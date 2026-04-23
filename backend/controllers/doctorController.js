const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const { success, error, paginate } = require('../utils/apiResponse');
const { CONSULTATION_STATUS, PAGINATION, SOCKET_EVENTS } = require('../utils/constants');
const { sendSseToAll } = require('../utils/sseHub');
const { emitToRealtimeBroadcast } = require('../utils/realtimeBridge');

/**
 * GET /api/doctors
 * Query: specialty, online, minRating, maxPrice, page, limit, search
 */
exports.getAllDoctors = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.specialty) filter.specialization = req.query.specialty;
    if (req.query.online === 'true') filter.online = true;
    if (req.query.minRating) filter.rating = { $gte: parseFloat(req.query.minRating) };
    if (req.query.maxPrice) filter.price = { ...(filter.price || {}), $lte: parseFloat(req.query.maxPrice) };
    if (req.query.minPrice) filter.price = { ...(filter.price || {}), $gte: parseFloat(req.query.minPrice) };
    if (req.query.verified === 'true') filter.isVerified = true;

    // Sort
    const sortMap = {
      rating: { rating: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      experience: { experience: -1 },
      consultations: { consultationCount: -1 },
    };
    const sort = sortMap[req.query.sort] || { rating: -1 };

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      const users = await User.find({
        role: 'doctor',
        $or: [{ name: regex }, { email: regex }],
      }).select('_id').lean();

      filter.$or = [
        { userId: { $in: users.map((user) => user._id) } },
        { specialization: regex },
        { 'hospital.name': regex },
        { 'hospital.city': regex },
      ];
    }

    let doctorQuery = Doctor.find(filter)
      .populate('userId', 'name email avatar phone')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const [doctors, total] = await Promise.all([
      doctorQuery,
      Doctor.countDocuments(filter),
    ]);

    return paginate(res, doctors, total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/:id
 */
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email avatar phone createdAt')
      .lean({ virtuals: true });
    if (!doctor) return error(res, 'Doctor not found', 404);
    return success(res, doctor);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/specialty/:specialty
 */
exports.getDoctorsBySpecialty = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ specialization: req.params.specialty })
      .populate('userId', 'name email avatar')
      .sort({ rating: -1 })
      .lean({ virtuals: true });
    return success(res, doctors);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/profile  (own profile)
 */
exports.getOwnProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar phone isEmailVerified createdAt')
      .lean({ virtuals: true });
    if (!doctor) return error(res, 'Doctor profile not found', 404);
    return success(res, doctor);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/doctors/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['bio', 'experience', 'price', 'languages', 'availability', 'hospital', 'qualification'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const userUpdates = {};
    if (req.body.name) userUpdates.name = req.body.name;
    if (req.body.phone) userUpdates.phone = req.body.phone;
    if (req.file?.path) userUpdates.avatar = req.file.path;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'name email avatar phone');

    if (!doctor) return error(res, 'Doctor profile not found', 404);

    return success(res, doctor);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/doctors/status  — toggle online
 */
exports.updateOnlineStatus = async (req, res, next) => {
  try {
    const { online } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { online: Boolean(online) },
      { new: true }
    );
    if (!doctor) return error(res, 'Doctor profile not found', 404);
    sendSseToAll(doctor.online ? SOCKET_EVENTS.DOCTOR_ONLINE : SOCKET_EVENTS.DOCTOR_OFFLINE, {
      doctorUserId: req.user._id,
      online: doctor.online,
      lastSeen: doctor.online ? undefined : new Date(),
    });
    emitToRealtimeBroadcast(
      doctor.online ? SOCKET_EVENTS.DOCTOR_ONLINE : SOCKET_EVENTS.DOCTOR_OFFLINE,
      {
        doctorUserId: req.user._id,
        online: doctor.online,
        lastSeen: doctor.online ? undefined : new Date(),
      },
    ).catch((socketErr) => {
      console.warn(`[doctor] Realtime status emit failed: ${socketErr.message}`);
    });
    return success(res, { online: doctor.online });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/consultations  (doctor's own)
 */
exports.getConsultations = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const doctor = await Doctor.findOne({ userId: req.user._id }).select('_id').lean();
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const filter = { doctor: doctor._id };
    if (req.query.status) filter.status = req.query.status;

    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .populate({ path: 'patient', populate: { path: 'userId', select: 'name avatar' } })
        .populate('prescription')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Consultation.countDocuments(filter),
    ]);

    return paginate(res, consultations, total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/patients
 * Unique patients who have consulted with the current doctor.
 */
exports.getPatients = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const doctor = await Doctor.findOne({ userId: req.user._id }).select('_id').lean();
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const match = { doctor: doctor._id };
    if (req.query.status) match.status = req.query.status;

    const [groups, totalResult] = await Promise.all([
      Consultation.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$patient',
            totalConsultations: { $sum: 1 },
            pendingConsultations: {
              $sum: { $cond: [{ $eq: ['$status', CONSULTATION_STATUS.PENDING] }, 1, 0] },
            },
            activeConsultations: {
              $sum: { $cond: [{ $eq: ['$status', CONSULTATION_STATUS.ACTIVE] }, 1, 0] },
            },
            completedConsultations: {
              $sum: { $cond: [{ $eq: ['$status', CONSULTATION_STATUS.COMPLETED] }, 1, 0] },
            },
            cancelledConsultations: {
              $sum: { $cond: [{ $eq: ['$status', CONSULTATION_STATUS.CANCELLED] }, 1, 0] },
            },
            lastConsultation: { $first: '$$ROOT' },
            lastConsultationAt: { $max: '$createdAt' },
          },
        },
        { $sort: { lastConsultationAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Consultation.aggregate([
        { $match: match },
        { $group: { _id: '$patient' } },
        { $count: 'total' },
      ]),
    ]);

    const patientIds = groups.map((item) => item._id).filter(Boolean);
    const [patients, prescriptionCounts] = await Promise.all([
      Patient.find({ _id: { $in: patientIds } })
        .populate('userId', 'name email avatar phone lastSeen')
        .lean({ virtuals: true }),
      Prescription.aggregate([
        { $match: { createdBy: doctor._id, createdFor: { $in: patientIds } } },
        { $group: { _id: '$createdFor', count: { $sum: 1 } } },
      ]),
    ]);

    const patientById = new Map(patients.map((patient) => [patient._id.toString(), patient]));
    const prescriptionCountByPatient = new Map(
      prescriptionCounts.map((item) => [item._id.toString(), item.count]),
    );

    const rows = groups
      .map((item) => {
        const patient = patientById.get(item._id?.toString());
        if (!patient) return null;
        return {
          patient,
          totalConsultations: item.totalConsultations,
          pendingConsultations: item.pendingConsultations,
          activeConsultations: item.activeConsultations,
          completedConsultations: item.completedConsultations,
          cancelledConsultations: item.cancelledConsultations,
          prescriptionsIssued: prescriptionCountByPatient.get(item._id.toString()) || 0,
          lastConsultation: item.lastConsultation,
          lastConsultationAt: item.lastConsultationAt,
        };
      })
      .filter(Boolean);

    return paginate(res, rows, totalResult[0]?.total || 0, page, limit);
  } catch (err) {
    next(err);
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * GET /api/doctors/dashboard
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate('userId', 'name avatar lastSeen')
      .lean({ virtuals: true });
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const [total, active, completed, prescriptionsIssued] = await Promise.all([
      Consultation.countDocuments({ doctor: doctor._id }),
      Consultation.countDocuments({ doctor: doctor._id, status: CONSULTATION_STATUS.ACTIVE }),
      Consultation.countDocuments({ doctor: doctor._id, status: CONSULTATION_STATUS.COMPLETED }),
      Prescription.countDocuments({ createdBy: doctor._id }),
    ]);

    const recentConsultations = await Consultation.find({ doctor: doctor._id })
      .populate({ path: 'patient', populate: { path: 'userId', select: 'name avatar' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    return success(res, {
      doctor,
      stats: { total, active, completed, prescriptionsIssued, rating: doctor.rating, ratingCount: doctor.ratingCount },
      recentConsultations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/doctors/:id/review
 */
exports.addReview = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const { consultationId } = req.body;
    if (!rating || rating < 1 || rating > 5) return error(res, 'Rating must be between 1 and 5', 400);

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return error(res, 'Doctor not found', 404);

    // Verify the patient had a completed consultation with this doctor
    const Patient = require('../models/Patient');
    const patient = await Patient.findOne({ userId: req.user._id });

    const consultation = await Consultation.findOne({
      _id: consultationId,
      patient: patient?._id,
      doctor: doctor._id,
      status: CONSULTATION_STATUS.COMPLETED,
    });

    if (!consultation) return error(res, 'No completed consultation found to review', 403);
    if (consultation.review?.rating) return error(res, 'Consultation already reviewed', 409);

    // Add review to consultation
    consultation.review = {
      rating,
      comment: req.body.comment?.trim() || undefined,
    };
    await consultation.save();

    // Update doctor rating
    await doctor.updateRating(rating);

    return success(res, {
      message: 'Review submitted',
      review: consultation.review,
      doctor: {
        _id: doctor._id,
        rating: doctor.rating,
        ratingCount: doctor.ratingCount,
      },
    });
  } catch (err) {
    next(err);
  }
};
