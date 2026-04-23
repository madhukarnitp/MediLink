const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { success, error } = require('../utils/apiResponse');
const { sendEmail, emailTemplates } = require('../utils/email');
const { ROLES, SOCKET_EVENTS } = require('../utils/constants');
const { emitToRealtimeBroadcast } = require('../utils/realtimeBridge');
const { sendSseToAll } = require('../utils/sseHub');

const DEFAULT_CLIENT_URL = 'http://localhost:3000';

const getClientUrl = () => (process.env.CLIENT_URL || DEFAULT_CLIENT_URL).replace(/\/$/, '');

const clearEmailVerificationState = (user) => {
  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;
  user.emailVerifyCode = undefined;
  user.emailVerifyCodeExpire = undefined;
};

const sendVerificationEmail = async (user) => {
  const rawToken = user.generateEmailVerifyToken();
  const verificationCode = user.generateEmailVerifyCode();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${getClientUrl()}/#/verify-email/${rawToken}`;
  const tmpl = emailTemplates.verifyEmail(user.name, verifyUrl, verificationCode);
  await sendEmail({ to: user.email, ...tmpl });
};

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  let user;
  try {
    const { name, email, password, role, phone, specialization, qualification, regNo, price } = req.body;
    const requestedRole = role || ROLES.PATIENT;

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already registered', 409);

    if (
      requestedRole === ROLES.DOCTOR &&
      (!specialization || !qualification || !regNo || price === undefined || price === null)
    ) {
      return error(res, 'Doctors must provide specialization, qualification, regNo, and price', 400);
    }

    // Create user
    user = await User.create({ name, email, password, role: requestedRole, phone });

    // Create role profile
    if (user.role === ROLES.PATIENT) {
      await Patient.create({ userId: user._id });
    } else if (user.role === ROLES.DOCTOR) {
      await Doctor.create({ userId: user._id, specialization, qualification, regNo, price });
    }

    // Send verification email
    try {
      await sendVerificationEmail(user);
    } catch (emailErr) {
      console.warn(`[auth] Email verification delivery failed for ${email}: ${emailErr.message}`);
    }

    return success(
      res,
      {
        user: user.toSafeJSON(),
        requiresVerification: true,
        emailVerificationRequired: true,
        accountVerificationRequired: requestedRole === ROLES.DOCTOR,
      },
      201
    );
  } catch (err) {
    if (user?._id) {
      await Promise.allSettled([
        Patient.deleteOne({ userId: user._id }),
        Doctor.deleteOne({ userId: user._id }),
        User.findByIdAndDelete(user._id),
      ]);
    }
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    const authBlock = await getAuthenticationBlock(user);
    if (authBlock) {
      return error(res, authBlock.message, authBlock.statusCode);
    }

    // Update lastSeen
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    // Set doctor online
    if (user.role === ROLES.DOCTOR) {
      await Doctor.findOneAndUpdate({ userId: user._id }, { online: true });
      sendSseToAll(SOCKET_EVENTS.DOCTOR_ONLINE, {
        doctorUserId: user._id,
        online: true,
      });
      emitToRealtimeBroadcast(SOCKET_EVENTS.DOCTOR_ONLINE, {
        doctorUserId: user._id,
        online: true,
      }).catch((socketErr) => {
        console.warn(`[auth] Realtime doctor online emit failed: ${socketErr.message}`);
      });
    }

    const token = user.getSignedToken();
    const refreshToken = user.getRefreshToken();

    console.log(`[auth] User signed in: ${email}`);
    return success(res, { token, refreshToken, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    if (req.user?.role === ROLES.DOCTOR) {
      await Doctor.findOneAndUpdate({ userId: req.user._id }, { online: false });
      const lastSeen = new Date();
      sendSseToAll(SOCKET_EVENTS.DOCTOR_OFFLINE, {
        doctorUserId: req.user._id,
        online: false,
        lastSeen,
      });
      emitToRealtimeBroadcast(SOCKET_EVENTS.DOCTOR_OFFLINE, {
        doctorUserId: req.user._id,
        online: false,
        lastSeen,
      }).catch((socketErr) => {
        console.warn(`[auth] Realtime doctor offline emit failed: ${socketErr.message}`);
      });
    }
    return success(res, null, 200);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (req.user.role === ROLES.PATIENT) {
      profile = await Patient.findOne({ userId: req.user._id });
    } else if (req.user.role === ROLES.DOCTOR) {
      profile = await Doctor.findOneAndUpdate(
        { userId: req.user._id },
        { online: true },
        { new: true }
      );
      sendSseToAll(SOCKET_EVENTS.DOCTOR_ONLINE, {
        doctorUserId: req.user._id,
        online: true,
      });
      emitToRealtimeBroadcast(SOCKET_EVENTS.DOCTOR_ONLINE, {
        doctorUserId: req.user._id,
        online: true,
      }).catch((socketErr) => {
        console.warn(`[auth] Realtime doctor online emit failed: ${socketErr.message}`);
      });
    }

    return success(res, { user: user.toSafeJSON(), profile });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/me
 */
exports.updateMe = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone || undefined;
    if (req.file?.path) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user) return error(res, 'User not found', 404);

    let profile = null;
    if (user.role === ROLES.PATIENT) {
      profile = await Patient.findOne({ userId: user._id });
    } else if (user.role === ROLES.DOCTOR) {
      profile = await Doctor.findOne({ userId: user._id });
    }

    return success(res, { user: user.toSafeJSON(), profile });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return error(res, 'Invalid refresh token', 401);

    const authBlock = await getAuthenticationBlock(user);
    if (authBlock) {
      return error(res, authBlock.message, authBlock.statusCode === 401 ? 401 : 403);
    }

    const newToken = user.getSignedToken();
    const newRefreshToken = user.getRefreshToken();
    return success(res, { token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return error(res, 'Invalid or expired refresh token', 401);
    }
    next(err);
  }
};

/**
 * POST /api/auth/request-verification
 */
exports.requestVerification = async (req, res, next) => {
  try {
    const email = req.body.email?.trim?.().toLowerCase();
    if (!email) return error(res, 'Email is required', 400);

    const user = await User.findOne({ email });
    if (!user) return error(res, 'No account found with that email', 404);
    if (user.isEmailVerified) {
      return success(res, { message: 'Email is already verified' });
    }

    try {
      await sendVerificationEmail(user);
    } catch (emailErr) {
      return error(res, 'Failed to send verification email. Try again later.', 500);
    }

    return success(res, {
      message: 'Verification code sent',
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-email
 */
exports.verifyEmailCode = async (req, res, next) => {
  try {
    const email = req.body.email?.trim?.().toLowerCase();
    const code = req.body.code?.trim?.();

    if (!email || !code) {
      return error(res, 'Email and verification code are required', 400);
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({
      email,
      emailVerifyCode: hashedCode,
      emailVerifyCodeExpire: { $gt: Date.now() },
    });
    if (!user) return error(res, 'Invalid or expired verification code', 400);

    clearEmailVerificationState(user);
    await user.save({ validateBeforeSave: false });

    return success(res, {
      message: 'Email verified successfully',
      email: user.email,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/verify-email/:token
 */
exports.verifyEmailToken = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpire: { $gt: Date.now() },
    });
    if (!user) return error(res, 'Invalid or expired verification link', 400);

    clearEmailVerificationState(user);
    await user.save({ validateBeforeSave: false });

    return success(res, {
      message: 'Email verified successfully',
      email: user.email,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return error(res, 'No account found with that email', 404);

    const rawToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${getClientUrl()}/reset-password/${rawToken}`;
    const tmpl = emailTemplates.passwordReset(user.name, resetUrl);

    try {
      await sendEmail({ to: user.email, ...tmpl });
      return success(res, { message: 'Password reset email sent' });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return error(res, 'Failed to send email. Try again later.', 500);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) return error(res, 'Invalid or expired reset link', 400);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedToken();
    return success(res, { token, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/change-password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);

    user.password = req.body.newPassword;
    await user.save();
    return success(res, { message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

async function getAuthenticationBlock(user) {
  // Check if account is blocked/deactivated
  if (!user.isActive) {
    return {
      message: 'Your account has been blocked. Please contact support.',
      statusCode: 401,
      code: 'ACCOUNT_BLOCKED',
    };
  }

  // Admin accounts are provisioned manually, so they do not use public email verification.
  if (user.role !== ROLES.ADMIN && !user.isEmailVerified) {
    return {
      message: 'Please verify your email before logging in',
      statusCode: 403,
      code: 'EMAIL_NOT_VERIFIED',
    };
  }

  // Doctor-specific verification required
  if (user.role === ROLES.DOCTOR) {
    const doctorProfile = await Doctor.findOne({ userId: user._id })
      .select('isVerified')
      .lean();

    if (!doctorProfile?.isVerified) {
      return {
        message: 'Your doctor account is pending admin verification. You will be able to login once verified.',
        statusCode: 403,
        code: 'DOCTOR_NOT_VERIFIED',
      };
    }
  }

  // All verification passed
  return null;
}
