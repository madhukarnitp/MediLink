const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  refreshToken,
  requestVerification,
  verifyEmailCode,
  verifyEmailToken,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleAvatarUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');

// ── Validation chains ─────────────────────────────────────────────────────────

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 60 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('specialization').if(body('role').equals('doctor')).notEmpty().withMessage('Specialization required for doctors'),
  body('qualification').if(body('role').equals('doctor')).notEmpty().withMessage('Qualification required for doctors'),
  body('regNo').if(body('role').equals('doctor')).notEmpty().withMessage('Registration number required for doctors'),
  body('price').if(body('role').equals('doctor')).isFloat({ min: 0 }).withMessage('Valid price required for doctors'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

const requestVerificationRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

const verifyEmailRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('code')
    .trim()
    .isLength({ min: 4, max: 8 })
    .withMessage('Verification code is required'),
];

const resetRules = [
  param('token').notEmpty(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

const updateMeRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be 2-60 characters'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Invalid phone number'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (patient or doctor)
 *     tags: [Auth]
 */
router.post('/register', registerRules, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT
 *     tags: [Auth]
 */
router.post('/login', loginRules, validate, login);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, handleAvatarUpload, updateMeRules, validate, updateMe);
router.post('/refresh', refreshToken);
router.post('/request-verification', requestVerificationRules, validate, requestVerification);
router.post('/verify-email', verifyEmailRules, validate, verifyEmailCode);
router.get('/verify-email/:token', verifyEmailToken);
router.post('/forgot-password', forgotRules, validate, forgotPassword);
router.put('/reset-password/:token', resetRules, validate, resetPassword);
router.put('/change-password', protect, changePasswordRules, validate, changePassword);

module.exports = router;
