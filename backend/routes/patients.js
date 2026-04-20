const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getPrescriptions,
  getActivePrescriptions,
  getPrescriptionById,
  getConsultations,
  getDashboard,
  getReports,
  getVitals,
  searchPatients,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const { handleAvatarUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { ROLES, BLOOD_GROUPS, GENDERS } = require('../utils/constants');

const updateProfileRules = [
  body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Age must be 0–150'),
  body('gender').optional().isIn(GENDERS).withMessage('Invalid gender'),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  body('bloodGroup').optional().isIn(BLOOD_GROUPS).withMessage('Invalid blood group'),
];

const prescriptionIdRules = [
  param('id').isMongoId().withMessage('Invalid prescription ID'),
];

// Doctor-accessible route: search patients
router.get('/search', protect, authorize(ROLES.DOCTOR), searchPatients);

// All routes below require patient auth
router.get('/dashboard', protect, authorize(ROLES.PATIENT), getDashboard);
router.get('/profile', protect, authorize(ROLES.PATIENT), getProfile);
router.put('/profile', protect, authorize(ROLES.PATIENT), handleAvatarUpload, updateProfileRules, validate, updateProfile);

// Register /active before /:id so Express does not treat "active" as an id.
router.get('/prescriptions/active', protect, authorize(ROLES.PATIENT), getActivePrescriptions);
router.get('/prescriptions/:id', protect, authorize(ROLES.PATIENT), prescriptionIdRules, validate, getPrescriptionById);
router.get('/prescriptions', protect, authorize(ROLES.PATIENT), getPrescriptions);

router.get('/reports', protect, authorize(ROLES.PATIENT), getReports);
router.get('/vitals', protect, authorize(ROLES.PATIENT), getVitals);
router.get('/consultations', protect, authorize(ROLES.PATIENT), getConsultations);

module.exports = router;
