const Consultation = require('../models/Consultation');
const Message = require('../models/Message');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { success, error, paginate } = require('../utils/apiResponse');
const { sendEmail, emailTemplates } = require('../utils/email');
const { CONSULTATION_STATUS, PAGINATION, SOCKET_EVENTS } = require('../utils/constants');
const { createNotification } = require('../utils/notifications');
const { emitToRealtimeRoom, emitToRealtimeUser } = require('../utils/realtimeBridge');
const { sendSseToUser } = require('../utils/sseHub');

/**
 * POST /api/consultations
 * Patient starts a consultation
 */
exports.startConsultation = async (req, res, next) => {
  try {
    const { doctorId } = req.body;
    const intake = normalizeIntake(req.body.intake);
    const reason = buildConsultationReason(req.body.reason, intake);

    const patient = await Patient.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!patient) return error(res, 'Patient profile not found', 404);

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
    if (!doctor) return error(res, 'Doctor not found', 404);

    // Check for existing active consultation between them
    const existing = await Consultation.findOne({
      patient: patient._id,
      doctor: doctor._id,
      status: { $in: [CONSULTATION_STATUS.PENDING, CONSULTATION_STATUS.ACTIVE] },
    });
    if (existing) {
      const populatedExisting = await existing.populate([
        { path: 'patient', populate: { path: 'userId', select: 'name avatar' } },
        { path: 'doctor', populate: { path: 'userId', select: 'name avatar' } },
      ]);

      await notifyDoctorConsultationRequest({
        consultation: populatedExisting,
        doctor,
        patient,
        reason: existing.reason || reason,
        intake: existing.intake || intake,
        reused: true,
      });

      return success(res, populatedExisting, 200, { reused: true });
    }

    // Generate a unique socket room id for chat and WebRTC.
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const roomId = `room-${patient._id.toString().slice(-6)}-${timestamp}-${randomStr}`;

    const consultation = await Consultation.create({
      patient: patient._id,
      doctor: doctor._id,
      reason,
      intake,
      status: CONSULTATION_STATUS.PENDING,
      roomId,
    });

    console.log(`[consultations] Consultation created: id=${consultation._id}, room=${roomId}`);

    // Notify doctor via email
    try {
      const tmpl = emailTemplates.consultationStarted(doctor.userId.name, patient.userId.name);
      await sendEmail({ to: doctor.userId.email, ...tmpl });
    } catch (emailErr) {
      console.warn(`[consultations] Consultation email delivery failed: ${emailErr.message}`);
    }

    const populated = await consultation.populate([
      { path: 'patient', populate: { path: 'userId', select: 'name avatar' } },
      { path: 'doctor', populate: { path: 'userId', select: 'name avatar' } },
    ]);

    await notifyDoctorConsultationRequest({
      consultation: populated,
      doctor,
      patient,
      reason,
      intake,
    });

    return success(res, populated, 201);
  } catch (err) {
    console.error(`[consultations] Consultation start failed: ${err.message}`);
    
    // Handle duplicate key errors specifically
    if (err.code === 11000) {
      return error(res, 'Consultation creation conflict - please try again', 409);
    }
    
    next(err);
  }
};

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeIntake(raw = {}) {
  const symptoms = Array.isArray(raw.symptoms)
    ? raw.symptoms
        .map((item) => cleanText(item, 80))
        .filter(Boolean)
        .slice(0, 12)
    : [];
  const severity = ['mild', 'moderate', 'severe', 'urgent'].includes(raw.severity)
    ? raw.severity
    : '';

  return {
    chiefComplaint: cleanText(raw.chiefComplaint, 500),
    symptoms,
    duration: cleanText(raw.duration, 120),
    severity,
    existingConditions: cleanText(raw.existingConditions, 500),
    currentMedicines: cleanText(raw.currentMedicines, 500),
    allergies: cleanText(raw.allergies, 300),
    notes: cleanText(raw.notes, 1000),
  };
}

function buildConsultationReason(rawReason, intake) {
  const complaint = intake?.chiefComplaint;
  if (complaint) return complaint.slice(0, 300);
  return cleanText(rawReason, 300) || 'General consultation';
}

async function notifyDoctorConsultationRequest({ consultation, doctor, patient, reason, intake, reused = false }) {
  const doctorUserId = doctor?.userId?._id;
  if (doctorUserId) {
    const payload = {
      consultationId: consultation._id,
      roomId: consultation.roomId,
      status: consultation.status,
      reused,
      patient: {
        name: patient.userId?.name || 'A patient',
        id: patient._id,
      },
      reason: reason || 'General consultation',
      intake: intake || consultation.intake,
      createdAt: consultation.createdAt,
    };

    const notification = await createNotification({
      user: doctorUserId,
      title: reused ? 'Consultation request reopened' : 'New consultation request',
      body: reason
        ? `${patient.userId?.name || 'A patient'}: ${reason}`
        : `${patient.userId?.name || 'A patient'} requested a consultation.`,
      type: 'consultation_request',
      page: 'consultation',
      params: { consultationId: consultation._id },
      emit: false,
    });

    if (notification?._id) {
      payload.notificationId = notification._id;
    }

    sendSseToUser(doctorUserId, 'consultationRequest', payload);

    emitToRealtimeUser(
      doctorUserId,
      'consultationRequest',
      payload,
    )
      .then((sent) => {
        if (sent) {
          console.log(`[consultations] Realtime notification sent to doctor ${doctor.userId.name}`);
        }
      })
      .catch((socketErr) => {
        console.warn(`[consultations] Realtime notification failed: ${socketErr.message}`);
      });
  }
}

/**
 * PUT /api/consultations/:id/leave
 * Lightweight call-leave signal. Authenticated participants notify the room;
 * unauthenticated unload/beacon calls are accepted as no-ops to avoid noisy 401s.
 */
exports.leaveConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return error(res, 'Consultation not found', 404);

    if (!req.user) {
      return success(res, { message: 'Call leave acknowledged' }, 202);
    }

    await _assertAccess(req.user, consultation);

    try {
      const roomId = consultation.roomId || consultation._id.toString();

      if (roomId) {
        const payload = {
          consultationId: consultation._id,
          roomId,
          userId: req.user._id,
          role: req.user.role,
          name: req.user.name,
          leftAt: new Date(),
        };

        await emitToRealtimeRoom(roomId, 'webrtc:peer-left', payload);
        await emitToRealtimeRoom(roomId, 'peerLeft', payload);
      }
    } catch (socketErr) {
      console.warn(`[consultations] Realtime leave signal failed: ${socketErr.message}`);
    }

    return success(res, { message: 'Call leave acknowledged' }, 202);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/consultations/:id
 * Patient or Doctor (own)
 */
exports.getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate({ path: 'patient', populate: { path: 'userId', select: 'name avatar email' } })
      .populate({ path: 'doctor', populate: { path: 'userId', select: 'name avatar email' } })
      .populate('prescription');

    if (!consultation) return error(res, 'Consultation not found', 404);

    // Access control
    await _assertAccess(req.user, consultation);

    return success(res, consultation);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/consultations/:id/accept
 * Doctor accepts a pending consultation
 */
exports.acceptConsultation = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).select('_id').lean();
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    let alreadyActive = false;
    let consultation = await Consultation.findOneAndUpdate(
      { _id: req.params.id, doctor: doctor._id, status: CONSULTATION_STATUS.PENDING },
      { status: CONSULTATION_STATUS.ACTIVE, startedAt: new Date() },
      { new: true }
    ).populate([
      { path: 'patient', populate: { path: 'userId', select: 'name avatar email' } },
      { path: 'doctor', populate: { path: 'userId', select: 'name avatar' } },
    ]);

    if (!consultation) {
      consultation = await Consultation.findOne({
        _id: req.params.id,
        doctor: doctor._id,
      }).populate([
        { path: 'patient', populate: { path: 'userId', select: 'name avatar email' } },
        { path: 'doctor', populate: { path: 'userId', select: 'name avatar' } },
      ]);
      if (!consultation) return error(res, 'Consultation not found', 404);
      if (consultation.status !== CONSULTATION_STATUS.ACTIVE) {
        return error(res, `Consultation is ${consultation.status} and cannot be accepted`, 409);
      }
      alreadyActive = true;
    }

    if (!alreadyActive) {
      // Increment once, only when this request actually moves pending -> active.
      await Doctor.findByIdAndUpdate(doctor._id, { $inc: { consultationCount: 1 } });
    }

    // 🔔 Notify patient that doctor accepted
    if (!alreadyActive) {
      try {
        const patientUserId = consultation.patient?.userId?._id || consultation.patient?.userId;
        if (patientUserId) {
          const payload = {
            consultationId: consultation._id,
            doctorName: consultation.doctor?.userId?.name || 'Your doctor',
          };
          sendSseToUser(patientUserId, 'consultationAccepted', payload);
          await emitToRealtimeUser(patientUserId, 'consultationAccepted', payload);
          await createNotification({
            user: patientUserId,
            title: 'Consultation accepted',
            body: `${consultation.doctor?.userId?.name || 'Your doctor'} accepted your consultation request.`,
            type: 'consultation_accepted',
            page: 'consultation',
            params: { consultationId: consultation._id },
            emit: false,
          });
        }
      } catch (socketErr) {
        console.warn(`[consultations] Realtime accept notification failed: ${socketErr.message}`);
      }
    }

    return success(res, consultation, 200, { alreadyActive });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/consultations/:id/end
 * Doctor ends an active consultation
 */
exports.endConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return error(res, 'Consultation not found', 404);

    await _assertAccess(req.user, consultation);

    if (consultation.status === CONSULTATION_STATUS.CANCELLED) {
      return error(res, 'Cancelled consultations cannot be ended', 400);
    }

    if (
      consultation.status !== CONSULTATION_STATUS.ACTIVE &&
      consultation.status !== CONSULTATION_STATUS.COMPLETED
    ) {
      return error(res, 'Only active consultations can be ended', 400);
    }

    const wasActive = consultation.status === CONSULTATION_STATUS.ACTIVE;
    if (wasActive) {
      await consultation.endConsultation();
    }

    if (req.user.role === 'doctor' && req.body.notes) {
      consultation.notes = req.body.notes;
      await consultation.save();
    }

    const populated = await consultation.populate([
      { path: 'patient', populate: { path: 'userId', select: 'name avatar' } },
      { path: 'doctor', populate: { path: 'userId', select: 'name avatar' } },
      { path: 'prescription' },
    ]);

    if (wasActive) {
      try {
        const roomId = consultation.roomId || consultation._id.toString();

        if (roomId) {
          const payload = {
            consultationId: consultation._id,
            roomId,
            endedBy: {
              userId: req.user._id,
              role: req.user.role,
              name: req.user.name,
            },
            endedAt: consultation.endedAt,
          };

          await emitToRealtimeRoom(roomId, SOCKET_EVENTS.CONSULTATION_ENDED, payload);
          await emitToRealtimeRoom(roomId, 'webrtc:call-ended', payload);
        }

        const patientUserId = populated.patient?.userId?._id || populated.patient?.userId;
        const doctorUserId = populated.doctor?.userId?._id || populated.doctor?.userId;
        const targetUserId =
          req.user.role === 'doctor' ? patientUserId : doctorUserId;
        await createNotification({
          user: targetUserId,
          title: 'Consultation ended',
          body: 'Your live consultation has been closed.',
          type: 'consultation_ended',
          page: 'consultation_list',
          params: { consultationId: consultation._id },
        });
      } catch (socketErr) {
        console.warn(`[consultations] Realtime end notification failed: ${socketErr.message}`);
      }
    }

    return success(res, populated);
  } catch (err) {
    next(err);
  }
};

/**
 * get /api/consultations/pending
 * get Doctors all pending consultation
 */

/**
 * GET /api/consultations/pending
 * Get doctor's pending consultations
 */
exports.getPendingConsultations = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const consultations = await Consultation.find({
      doctor: doctor._id,  // ← Use doctor._id (matches schema)
      status: CONSULTATION_STATUS.PENDING,  // ← Use constant
    })
    .populate({
      path: 'patient', 
      populate: { 
        path: 'userId', 
        select: 'name email avatar'  // ← More patient info
      }
    })
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });  // ← Newest first

    return success(res, consultations);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/consultations/:id/cancel
 * Patient or Doctor can cancel a pending consultation
 */
exports.cancelConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return error(res, 'Consultation not found', 404);

    await _assertAccess(req.user, consultation);

    if (consultation.status !== CONSULTATION_STATUS.PENDING) {
      return error(res, 'Only pending consultations can be cancelled', 400);
    }

    consultation.status = CONSULTATION_STATUS.CANCELLED;
    await consultation.save();

    return success(res, consultation);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/consultations/:id/messages
 * Send a message in a consultation
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return error(res, 'Consultation not found', 404);

    if (consultation.status !== CONSULTATION_STATUS.ACTIVE) {
      return error(res, 'Consultation is not active', 400);
    }

    await _assertAccess(req.user, consultation);

    const message = await Message.create({
      consultation: consultation._id,
      sender: req.user._id,
      senderRole: req.user.role,
      text: req.body.text,
      attachmentUrl: req.file?.path || undefined,
      attachmentType: req.file ? (req.file.mimetype.startsWith('image') ? 'image' : 'document') : undefined,
    });

    const populated = await message.populate('sender', 'name avatar');
    return success(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/consultations/:id/messages
 */
exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return error(res, 'Consultation not found', 404);

    await _assertAccess(req.user, consultation);

    const [messages, total] = await Promise.all([
      Message.find({ consultation: consultation._id })
        .populate('sender', 'name avatar')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Message.countDocuments({ consultation: consultation._id }),
    ]);

    // Mark unread messages as read
    await Message.updateMany(
      { consultation: consultation._id, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return paginate(res, messages, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ── Internal helpers ──────────────────────────────────────────────────────────

async function _assertAccess(user, consultation) {
  if (user.role === 'patient') {
    const patient = await Patient.findOne({ userId: user._id });
    if (!patient) throw Object.assign(new Error('Patient profile not found'), { statusCode: 404 });
    if (!consultation.patient.equals(patient._id)) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  } else if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw Object.assign(new Error('Doctor profile not found'), { statusCode: 404 });
    if (!consultation.doctor.equals(doctor._id)) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  } else {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }
}
