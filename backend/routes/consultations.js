const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  startConsultation,
  getConsultationById,
  acceptConsultation,
  endConsultation,
  leaveConsultation,
  cancelConsultation,
  sendMessage,
  getMessages,
  getPendingConsultations,
} = require('../controllers/consultationController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { handleDocumentUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { ROLES } = require('../utils/constants');

const startRules = [
  body('doctorId').isMongoId().withMessage('Valid doctor ID required'),
  body('reason').optional().isLength({ max: 300 }),
  body('intake').isObject().withMessage('Patient intake is required'),
  body('intake.chiefComplaint')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Issue must be 10-500 characters'),
  body('intake.symptoms').optional().isArray({ max: 12 }),
  body('intake.symptoms.*').optional().trim().isLength({ max: 80 }),
  body('intake.duration').optional().trim().isLength({ max: 120 }),
  body('intake.severity').optional().isIn(['mild', 'moderate', 'severe', 'urgent', '']),
  body('intake.existingConditions').optional().trim().isLength({ max: 500 }),
  body('intake.currentMedicines').optional().trim().isLength({ max: 500 }),
  body('intake.allergies').optional().trim().isLength({ max: 300 }),
  body('intake.notes').optional().trim().isLength({ max: 1000 }),
];

const messageRules = [
  body('text').optional().isLength({ max: 2000 }),
];

const idRules = [
  param('id').isMongoId().withMessage('Invalid consultation ID'),
];

// Patient: start a consultation
router.post('/', protect, authorize(ROLES.PATIENT), startRules, validate, startConsultation);

//Doctor: get all pending consultations
router.get('/pending', protect, authorize(ROLES.DOCTOR), getPendingConsultations);

// Both: get consultation
router.get('/:id', protect, idRules, validate, getConsultationById);

// Doctor: accept / end
router.put('/:id/accept', protect, authorize(ROLES.DOCTOR), idRules, validate, acceptConsultation);
router.put('/:id/end', protect, authorize(ROLES.DOCTOR, ROLES.PATIENT), idRules, validate, endConsultation);
router.put('/:id/leave', optionalAuth, idRules, validate, leaveConsultation);

// Both: cancel
router.put('/:id/cancel', protect, idRules, validate, cancelConsultation);

// Both: messages
router.post('/:id/messages', protect, handleDocumentUpload, idRules, messageRules, validate, sendMessage);
router.get('/:id/messages', protect, idRules, validate, getMessages);

module.exports = router;
