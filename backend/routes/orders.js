const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  createOrder,
  getPrescriptionOrderPreview,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, ROLES } = require('../utils/constants');

const objectIdRule = (field) => param(field).isMongoId().withMessage(`Invalid ${field}`);

const listRules = [
  query('status').optional().isIn(Object.values(ORDER_STATUS)).withMessage('Invalid order status'),
  query('patientId').optional().isMongoId().withMessage('Invalid patientId'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be at least 1'),
];

const createRules = [
  body('prescriptionId').optional().isMongoId().withMessage('Invalid prescriptionId'),
  body('items').optional().isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.name').if(body('items').exists()).trim().notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price cannot be negative'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Recipient name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Recipient phone is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').optional().isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('deliveryFee').optional().isFloat({ min: 0 }).withMessage('Delivery fee cannot be negative'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax cannot be negative'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount cannot be negative'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const updateStatusRules = [
  objectIdRule('id'),
  body('status').optional().isIn(Object.values(ORDER_STATUS)).withMessage('Invalid order status'),
  body('paymentStatus').optional().isIn(Object.values(PAYMENT_STATUS)).withMessage('Invalid payment status'),
  body('note').optional().isLength({ max: 300 }).withMessage('Note cannot exceed 300 characters'),
  body().custom((value) => {
    if (!value.status && !value.paymentStatus) {
      throw new Error('status or paymentStatus is required');
    }
    return true;
  }),
];

const cancelRules = [
  objectIdRule('id'),
  body('reason').optional().isLength({ max: 300 }).withMessage('Reason cannot exceed 300 characters'),
];

router.get('/', protect, listRules, validate, getOrders);
router.get(
  '/prescriptions/:prescriptionId/availability',
  protect,
  authorize(ROLES.PATIENT),
  param('prescriptionId').isMongoId().withMessage('Invalid prescriptionId'),
  validate,
  getPrescriptionOrderPreview
);
router.post('/', protect, authorize(ROLES.PATIENT), createRules, validate, createOrder);
router.get('/:id', protect, objectIdRule('id'), validate, getOrderById);
router.put('/:id/status', protect, authorize(ROLES.ADMIN), updateStatusRules, validate, updateOrderStatus);
router.put('/:id/cancel', protect, cancelRules, validate, cancelOrder);

module.exports = router;
