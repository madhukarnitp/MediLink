const Patient = require('../models/Patient');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Report = require('../models/Report');
const Vital = require('../models/Vital');
const { success, error, paginate } = require('../utils/apiResponse');
const { PRESCRIPTION_STATUS, CONSULTATION_STATUS, PAGINATION } = require('../utils/constants');
const { addPublicVerification } = require('../utils/prescriptionVerification');

/**
 * GET /api/patients/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('user', 'name email phone avatar isEmailVerified createdAt')
      .lean({ virtuals: true });
    if (!patient) return error(res, 'Patient profile not found', 404);
    return success(res, patient);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/patients/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['age', 'gender', 'weight', 'height', 'bloodGroup', 'allergies', 'chronicConditions', 'emergencyContact', 'address', 'medicalHistory'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const userUpdates = {};
    if (req.body.name) userUpdates.name = req.body.name;
    if (req.body.phone) userUpdates.phone = req.body.phone;
    if (req.file?.path) userUpdates.avatar = req.file.path;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone avatar');

    if (!patient) return error(res, 'Patient profile not found', 404);

    return success(res, patient);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/prescriptions
 */
exports.getPrescriptions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    console.log(`[patient] getPrescriptions: userId=${req.user._id}, patient=${patient ? patient._id : 'not found'}`);
    if (!patient) return error(res, 'Patient profile not found', 404);

    const filter = { createdFor: patient._id };
    if (req.query.status) filter.status = req.query.status;

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Prescription.countDocuments(filter),
    ]);

    console.log(`[patient] getPrescriptions: found ${prescriptions.length} prescriptions`);
    return paginate(res, prescriptions.map(addPublicVerification), total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/reports
 */
exports.getReports = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    if (!patient) return error(res, 'Patient profile not found', 404);

    const filter = { patient: patient._id };
    if (req.query.type) filter.type = req.query.type;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate({ path: 'doctor', populate: { path: 'userId', select: 'name avatar' } })
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Report.countDocuments(filter),
    ]);

    return paginate(res, reports, total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/vitals
 */
exports.getVitals = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    if (!patient) return error(res, 'Patient profile not found', 404);

    const [vitals, total] = await Promise.all([
      Vital.find({ patient: patient._id })
        .populate({ path: 'doctor', populate: { path: 'userId', select: 'name avatar' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vital.countDocuments({ patient: patient._id }),
    ]);

    return paginate(res, vitals, total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/prescriptions/active
 */
exports.getActivePrescriptions = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    if (!patient) return error(res, 'Patient profile not found', 404);

    // Auto-expire stale
    await Prescription.updateMany(
      { createdFor: patient._id, status: PRESCRIPTION_STATUS.ACTIVE, expiresAt: { $lt: new Date() } },
      { status: PRESCRIPTION_STATUS.EXPIRED }
    );

    const prescriptions = await Prescription.find({
      createdFor: patient._id,
      status: PRESCRIPTION_STATUS.ACTIVE,
    })
      .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return success(res, prescriptions.map(addPublicVerification));
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/patients/prescriptions/:id
 */
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    if (!patient) return error(res, 'Patient profile not found', 404);

    const prescription = await Prescription.findOne({ _id: req.params.id, createdFor: patient._id })
      .populate({ path: 'createdBy', populate: { path: 'userId', select: 'name avatar' } })
      .populate({ path: 'createdFor', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('consultation')
      .lean({ virtuals: true });

    if (!prescription) return error(res, 'Prescription not found', 404);
    return success(res, addPublicVerification(prescription));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/consultations
 */
exports.getConsultations = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const patient = await Patient.findOne({ userId: req.user._id }).select('_id').lean();
    if (!patient) return error(res, 'Patient profile not found', 404);
    const filter = { patient: patient._id };
    if (req.query.status) filter.status = req.query.status;
    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .populate({ path: 'doctor', populate: { path: 'userId', select: 'name avatar' } })
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
 * GET /api/patients/dashboard — stats summary
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('user', 'name avatar lastSeen')
      .lean({ virtuals: true });
    if (!patient) return error(res, 'Patient profile not found', 404);

    const [totalConsultations, activeConsultations, activePrescriptions, totalPrescriptions] = await Promise.all([
      Consultation.countDocuments({ patient: patient._id }),
      Consultation.countDocuments({ patient: patient._id, status: CONSULTATION_STATUS.ACTIVE }),
      Prescription.countDocuments({ createdFor: patient._id, status: PRESCRIPTION_STATUS.ACTIVE }),
      Prescription.countDocuments({ createdFor: patient._id }),
    ]);

    const recentConsultations = await Consultation.find({ patient: patient._id })
      .populate({ path: 'doctor', populate: { path: 'userId', select: 'name avatar' } })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean({ virtuals: true });

    return success(res, {
      patient,
      stats: { totalConsultations, activeConsultations, activePrescriptions, totalPrescriptions },
      recentConsultations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/search  (Doctor only)
 * Search patients by name or email
 */
exports.searchPatients = async (req, res, next) => {
  try {
    const q = (req.query.search || req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, data: [] });
    }
    const regex = new RegExp(escapeRegex(q), 'i');
    // Find matching users with role patient
    const users = await User.find({
      role: 'patient',
      $or: [{ name: regex }, { email: regex }],
    }).select('_id name email phone').limit(20).lean();

    const userIds = users.map((u) => u._id);
    const patients = await Patient.find({ userId: { $in: userIds } })
      .populate('user', 'name email phone')
      .lean({ virtuals: true });

    return res.json({ success: true, data: patients });
  } catch (err) {
    next(err);
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
