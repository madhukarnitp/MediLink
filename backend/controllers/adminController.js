const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { success, error, paginate } = require('../utils/apiResponse');
const { ROLES, PAGINATION } = require('../utils/constants');

const USER_SELECT =
  '-password -emailVerifyToken -emailVerifyExpire -emailVerifyCode -emailVerifyCodeExpire -resetPasswordToken -resetPasswordExpire';

exports.createUser = async (req, res, next) => {
  let user;

  try {
    const { name, email, password, role = ROLES.PATIENT, phone, patientProfile = {}, doctorProfile = {} } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already registered', 409);

    user = await User.create({ name, email, password, role, phone });

    if (role === ROLES.PATIENT) {
      await Patient.create({ userId: user._id, ...patientProfile });
    } else if (role === ROLES.DOCTOR) {
      const missing = getMissingDoctorFields(doctorProfile);
      if (missing.length > 0) {
        await cleanupUser(user._id);
        return error(res, `Doctor profile missing: ${missing.join(', ')}`, 400);
      }
      await Doctor.create({ userId: user._id, ...doctorProfile });
    }

    const data = await buildUserPayload(user._id);
    return success(res, data, 201);
  } catch (err) {
    if (user?._id) await cleanupUser(user._id);
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};

    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(USER_SELECT)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      User.countDocuments(filter),
    ]);

    const userIds = users.map((user) => user._id);
    const [patients, doctors] = await Promise.all([
      Patient.find({ userId: { $in: userIds } }).lean({ virtuals: true }),
      Doctor.find({ userId: { $in: userIds } }).lean({ virtuals: true }),
    ]);
    const profileByUserId = new Map();
    patients.forEach((profile) => profileByUserId.set(profile.userId.toString(), profile));
    doctors.forEach((profile) => profileByUserId.set(profile.userId.toString(), profile));

    const usersWithProfiles = users.map((user) => ({
      ...user,
      profile: profileByUserId.get(user._id.toString()) || null,
    }));

    return paginate(res, usersWithProfiles, total, page, limit);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const data = await buildUserPayload(req.params.id);
    if (!data) return error(res, 'User not found', 404);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'User not found', 404);

    const userFields = ['name', 'email', 'phone', 'role', 'isActive', 'isEmailVerified'];
    userFields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    await syncProfileForUser(user, req.body.patientProfile, req.body.doctorProfile);

    const data = await buildUserPayload(user._id);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    if (req.user._id.equals(req.params.id)) {
      return error(res, 'Admins cannot deactivate their own account', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true, runValidators: true }
    ).select(USER_SELECT);

    if (!user) return error(res, 'User not found', 404);

    if (user.role === ROLES.DOCTOR) {
      await Doctor.findOneAndUpdate({ userId: user._id }, { online: false });
    }

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

exports.restoreUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true, runValidators: true }
    ).select(USER_SELECT);

    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const [
      users,
      activeUsers,
      doctors,
      verifiedDoctors,
      patients,
      orders,
      pendingOrders,
      medicines,
      availableMedicines,
      lowStockMedicines,
      outOfStockMedicines,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: ROLES.DOCTOR }),
      Doctor.countDocuments({ isVerified: true }),
      User.countDocuments({ role: ROLES.PATIENT }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Medicine.countDocuments({ isActive: true }),
      Medicine.countDocuments({ isActive: true, available: true, stock: { $gt: 0 } }),
      Medicine.countDocuments({
        isActive: true,
        available: true,
        $expr: { $lte: ['$stock', '$lowStockThreshold'] },
        stock: { $gt: 0 },
      }),
      Medicine.countDocuments({
        isActive: true,
        $or: [{ available: false }, { stock: { $lte: 0 } }],
      }),
    ]);

    return success(res, {
      users,
      activeUsers,
      doctors,
      verifiedDoctors,
      pendingDoctorVerification: Math.max(doctors - verifiedDoctors, 0),
      patients,
      orders,
      pendingOrders,
      medicines,
      availableMedicines,
      lowStockMedicines,
      outOfStockMedicines,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMedicines = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { isActive: req.query.includeArchived === 'true' ? { $in: [true, false] } : true };
    const andConditions = [];

    if (req.query.available !== undefined) filter.available = req.query.available === 'true';
    if (req.query.category) filter.category = req.query.category;
    if (req.query.stockStatus === 'out_of_stock') {
      andConditions.push({ $or: [{ available: false }, { stock: { $lte: 0 } }] });
    } else if (req.query.stockStatus === 'low_stock') {
      filter.available = true;
      filter.stock = { $gt: 0 };
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    } else if (req.query.stockStatus === 'available') {
      filter.available = true;
      filter.$expr = { $gt: ['$stock', '$lowStockThreshold'] };
    }

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      andConditions.push({
        $or: [
          { name: regex },
          { genericName: regex },
          { brand: regex },
          { category: regex },
        ],
      });
    }

    if (andConditions.length) filter.$and = andConditions;

    const [medicines, total] = await Promise.all([
      Medicine.find(filter)
        .populate('updatedBy', 'name role')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Medicine.countDocuments(filter),
    ]);

    return paginate(res, medicines, total, page, limit);
  } catch (err) {
    next(err);
  }
};

exports.createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create({
      ...sanitizeMedicinePayload(req.body),
      updatedBy: req.user._id,
    });
    return success(res, medicine, 201);
  } catch (err) {
    if (err.code === 11000) return error(res, 'Medicine already exists', 409);
    next(err);
  }
};

exports.updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        ...sanitizeMedicinePayload(req.body),
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate('updatedBy', 'name role');

    if (!medicine) return error(res, 'Medicine not found', 404);
    return success(res, medicine);
  } catch (err) {
    if (err.code === 11000) return error(res, 'Medicine already exists', 409);
    next(err);
  }
};

exports.archiveMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false, available: false, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!medicine) return error(res, 'Medicine not found', 404);
    return success(res, medicine);
  } catch (err) {
    next(err);
  }
};

async function buildUserPayload(userId) {
  const user = await User.findById(userId).select(USER_SELECT).lean({ virtuals: true });
  if (!user) return null;

  let profile = null;
  if (user.role === ROLES.PATIENT) {
    profile = await Patient.findOne({ userId: user._id }).lean({ virtuals: true });
  } else if (user.role === ROLES.DOCTOR) {
    profile = await Doctor.findOne({ userId: user._id }).lean({ virtuals: true });
  }

  return { user, profile };
}

async function syncProfileForUser(user, patientProfile = {}, doctorProfile = {}) {
  if (user.role === ROLES.PATIENT) {
    await Patient.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id }, $set: patientProfile || {} },
      { new: true, upsert: true, runValidators: true }
    );
    return;
  }

  if (user.role === ROLES.DOCTOR) {
    const existingDoctor = await Doctor.findOne({ userId: user._id });
    const nextProfile = { ...(existingDoctor?.toObject() || {}), ...(doctorProfile || {}) };
    const missing = getMissingDoctorFields(nextProfile);

    if (!existingDoctor && missing.length > 0) {
      throw Object.assign(new Error(`Doctor profile missing: ${missing.join(', ')}`), { statusCode: 400 });
    }

    await Doctor.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id }, $set: doctorProfile || {} },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

function getMissingDoctorFields(profile = {}) {
  return ['specialization', 'qualification', 'regNo', 'price'].filter((field) => {
    return profile[field] === undefined || profile[field] === null || profile[field] === '';
  });
}

function sanitizeMedicinePayload(payload = {}) {
  const allowed = [
    'name',
    'genericName',
    'brand',
    'category',
    'dosageForm',
    'strength',
    'unitPrice',
    'mrp',
    'stock',
    'lowStockThreshold',
    'available',
    'requiresPrescription',
    'manufacturer',
    'description',
    'isActive',
  ];
  return allowed.reduce((acc, field) => {
    if (payload[field] !== undefined) acc[field] = payload[field];
    return acc;
  }, {});
}

async function cleanupUser(userId) {
  await Promise.allSettled([
    Patient.deleteOne({ userId }),
    Doctor.deleteOne({ userId }),
    User.findByIdAndDelete(userId),
  ]);
}

function getPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const requestedLimit = parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), PAGINATION.MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
