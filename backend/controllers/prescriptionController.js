const Prescription = require('../models/Prescription');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const { success, error, paginate } = require('../utils/apiResponse');
const { sendEmail, emailTemplates } = require('../utils/email');
const { CONSULTATION_STATUS, PRESCRIPTION_STATUS, PAGINATION } = require('../utils/constants');
const {
  addPublicVerification,
  isValidPrescriptionVerificationToken,
} = require('../utils/prescriptionVerification');

const getVerification = (prescription, checkedAt = new Date()) => {
  const expiresAt = prescription.expiresAt ? new Date(prescription.expiresAt) : null;
  const isExpired = Boolean(expiresAt && expiresAt < checkedAt);
  const doctorVerified = prescription.createdBy?.isVerified === true;
  const isActive = prescription.status === PRESCRIPTION_STATUS.ACTIVE && !isExpired;
  const verified = Boolean(isActive && doctorVerified);

  let reason = 'Prescription is active and issued by a verified MediLink doctor.';
  if (prescription.status === PRESCRIPTION_STATUS.CANCELLED) {
    reason = 'Prescription was cancelled by the issuing doctor.';
  } else if (prescription.status === PRESCRIPTION_STATUS.EXPIRED || isExpired) {
    reason = 'Prescription has expired.';
  } else if (!doctorVerified) {
    reason = 'Issuing doctor is not verified.';
  }

  return {
    verified,
    checkedAt: checkedAt.toISOString(),
    reason,
  };
};

const getUserName = (profile, fallback) =>
  profile?.userId?.name || profile?.name || fallback;

const getDoctorRegistration = (doctor) =>
  doctor?.registrationNumber ||
  doctor?.regNo ||
  doctor?.licenseNumber ||
  doctor?.medicalLicenseNumber ||
  '';

const getDoctorQualification = (doctor) =>
  doctor?.qualification ||
  doctor?.qualifications ||
  doctor?.specialization ||
  doctor?.specialty ||
  '';

const toPublicPrescriptionView = (prescriptionDoc, checkedAt = new Date()) => {
  const prescription = addPublicVerification(prescriptionDoc);
  const verification = getVerification(prescription, checkedAt);
  const issuedAt = prescription.createdAt
    ? new Date(prescription.createdAt).toISOString()
    : null;
  const expiresAt = prescription.expiresAt
    ? new Date(prescription.expiresAt).toISOString()
    : null;

  return {
    ...prescription,
    verification,
    view: {
      id: prescription._id?.toString(),
      rxId: prescription.rxId || '',
      diagnosis: prescription.diagnosis || '',
      status: prescription.status || PRESCRIPTION_STATUS.ACTIVE,
      issuedAt,
      expiresAt,
      doctor: {
        name: getUserName(prescription.createdBy, 'Doctor'),
        avatar: prescription.createdBy?.userId?.avatar || '',
        qualification: getDoctorQualification(prescription.createdBy),
        registrationNumber: getDoctorRegistration(prescription.createdBy),
        verified: prescription.createdBy?.isVerified === true,
      },
      patient: {
        name: getUserName(prescription.createdFor, 'Patient'),
        age: prescription.createdFor?.age || '',
        gender: prescription.createdFor?.gender || '',
      },
      verificationUrl: prescription.publicVerification?.path || '',
      verification,
    },
  };
};

/**
 * POST /api/prescriptions
 * Doctor only
 */
exports.createPrescription = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name');
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const { patientId, consultationId, diagnosis, symptoms, medicines, labTests, advice, followUpDate, notes } = req.body;

    const patient = await Patient.findById(patientId).populate('userId', 'name email');
    if (!patient) return error(res, 'Patient not found', 404);

    // Optionally link to one of this doctor's consultations for this patient.
    if (consultationId) {
      const consultation = await Consultation.findById(consultationId);
      if (!consultation) return error(res, 'Consultation not found', 404);
      if (!consultation.doctor.equals(doctor._id) || !consultation.patient.equals(patient._id)) {
        return error(res, 'Consultation does not match this doctor and patient', 403);
      }
    }

    const prescription = await Prescription.create({
      createdBy: doctor._id,
      createdFor: patient._id,
      consultation: consultationId || undefined,
      diagnosis,
      symptoms: symptoms || [],
      medicines,
      labTests: labTests || [],
      advice,
      followUpDate: followUpDate || undefined,
      notes,
    });

    // Attach prescription to consultation
    if (consultationId) {
      const linkedConsultation = await Consultation.findById(consultationId);
      if (linkedConsultation) {
        linkedConsultation.prescription = prescription._id;
        if (linkedConsultation.status === CONSULTATION_STATUS.PENDING) {
          linkedConsultation.status = CONSULTATION_STATUS.COMPLETED;
          linkedConsultation.startedAt = linkedConsultation.startedAt || new Date();
          linkedConsultation.endedAt = new Date();
          linkedConsultation.duration = 0;
          linkedConsultation.notes =
            linkedConsultation.notes || 'Prescription issued from patient intake.';
        }
        await linkedConsultation.save();
      }
    }

    // Email patient
    try {
      const tmpl = emailTemplates.prescriptionCreated(patient.userId.name, doctor.userId.name, diagnosis);
      await sendEmail({ to: patient.userId.email, ...tmpl });
    } catch (emailErr) {
      console.warn(`[prescriptions] Prescription email delivery failed: ${emailErr.message}`);
    }

    const populated = await prescription.populate([
      { path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } },
      { path: 'createdFor', populate: { path: 'userId', select: 'name email' } },
    ]);

    return success(res, addPublicVerification(populated), 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions/:id
 * Doctor (own) or Patient (own)
 */
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
      .populate({ path: 'createdFor', populate: { path: 'userId', select: 'name email' } })
      .populate('consultation');

    if (!prescription) return error(res, 'Prescription not found', 404);

    // Access control
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return error(res, 'Doctor profile not found', 404);
      if (!prescription.createdBy._id.equals(doctor._id)) {
        return error(res, 'Not authorized', 403);
      }
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return error(res, 'Patient profile not found', 404);
      if (!prescription.createdFor._id.equals(patient._id)) {
        return error(res, 'Not authorized', 403);
      }
    } else {
      return error(res, 'Not authorized', 403);
    }

    return success(res, addPublicVerification(prescription));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions/public/:id
 * Public prescription detail view. No login required. Sensitive internal notes
 * and consultation links are excluded.
 */
exports.getPublicPrescriptionById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return error(res, 'Prescription not found', 404);
    }

    const now = new Date();
    const prescriptionDoc = await Prescription.findById(req.params.id)
      .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
      .populate({ path: 'createdFor', populate: { path: 'userId', select: 'name' } })
      .select('-notes -consultation');

    if (!prescriptionDoc) return error(res, 'Prescription not found', 404);

    if (
      prescriptionDoc.status === PRESCRIPTION_STATUS.ACTIVE &&
      prescriptionDoc.expiresAt &&
      prescriptionDoc.expiresAt < now
    ) {
      prescriptionDoc.status = PRESCRIPTION_STATUS.EXPIRED;
      await prescriptionDoc.save();
    }

    return success(res, toPublicPrescriptionView(prescriptionDoc, now));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions/public/verify/:id?token=...
 * Public QR verification view. No login required. A signed token strengthens
 * the QR/link authenticity check when present, but public access is not blocked.
 */
exports.verifyPrescription = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return error(res, 'Prescription not found', 404);
    }

    const now = new Date();
    const prescriptionDoc = await Prescription.findById(req.params.id)
      .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
      .populate({ path: 'createdFor', populate: { path: 'userId', select: 'name' } })
      .select('-notes -consultation');

    if (!prescriptionDoc) return error(res, 'Prescription not found', 404);

    const token = String(req.query.token || '').trim();
    const tokenVerified = token
      ? isValidPrescriptionVerificationToken(prescriptionDoc, token)
      : false;

    if (
      prescriptionDoc.status === PRESCRIPTION_STATUS.ACTIVE &&
      prescriptionDoc.expiresAt &&
      prescriptionDoc.expiresAt < now
    ) {
      prescriptionDoc.status = PRESCRIPTION_STATUS.EXPIRED;
      await prescriptionDoc.save();
    }

    const publicView = toPublicPrescriptionView(prescriptionDoc, now);
    publicView.verification = {
      ...publicView.verification,
      publicAccess: true,
      tokenProvided: Boolean(token),
      tokenVerified,
    };
    publicView.view.verification = publicView.verification;

    return success(res, publicView);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/prescriptions/:id/status
 * Doctor only
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Object.values(PRESCRIPTION_STATUS).includes(status)) {
      return error(res, `Invalid status. Must be one of: ${Object.values(PRESCRIPTION_STATUS).join(', ')}`, 400);
    }

    const doctor = await Doctor.findOne({ userId: req.user._id }).select('_id').lean();
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, createdBy: doctor._id },
      { status },
      { new: true }
    );

    if (!prescription) return error(res, 'Prescription not found or not authorized', 404);
    return success(res, prescription);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions  (doctor's own issued prescriptions)
 */
exports.getDoctorPrescriptions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const filter = { createdBy: doctor._id };
    if (req.query.status) filter.status = req.query.status;

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate({ path: 'createdFor', populate: { path: 'userId', select: 'name avatar' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Prescription.countDocuments(filter),
    ]);

    return paginate(res, prescriptions.map(addPublicVerification), total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/prescriptions/:id  — cancel (soft)
 * Doctor only, only if active
 */
exports.cancelPrescription = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return error(res, 'Doctor profile not found', 404);

    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, createdBy: doctor._id, status: PRESCRIPTION_STATUS.ACTIVE },
      { status: PRESCRIPTION_STATUS.CANCELLED },
      { new: true }
    );

    if (!prescription) return error(res, 'Prescription not found, not yours, or not active', 404);
    return success(res, prescription);
  } catch (err) {
    next(err);
  }
};
