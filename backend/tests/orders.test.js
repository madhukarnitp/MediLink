const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { ROLES } = require('../utils/constants');

const MONGO_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/medilink_test';

jest.setTimeout(20000);

let patientToken;
let doctorToken;
let adminToken;
let patientId;
let prescriptionId;
let orderId;

const shippingAddress = {
  name: 'Order Patient',
  phone: '+911234567890',
  street: '12 Care Lane',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400001',
};

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  const patientRes = await request(app).post('/api/auth/register').send({
    name: 'Order Patient',
    email: 'order.patient@test.com',
    password: 'password123',
    role: 'patient',
  });
  const patient = await Patient.findOne({ userId: patientRes.body.data.user._id });
  patientId = patient._id.toString();

  const doctorRes = await request(app).post('/api/auth/register').send({
    name: 'Dr. Orders',
    email: 'order.doctor@test.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'General Physician',
    qualification: 'MBBS',
    regNo: 'ORDER-DR-001',
    price: 300,
  });
  await User.updateMany(
    {
      email: {
        $in: ['order.patient@test.com', 'order.doctor@test.com'],
      },
    },
    { isEmailVerified: true }
  );

  const doctor = await Doctor.findOne({ userId: doctorRes.body.data.user._id });
  doctor.isVerified = true;
  await doctor.save();
  await Medicine.create([
    { name: 'Paracetamol', unitPrice: 35, stock: 20, available: true },
    { name: 'Vitamin D', unitPrice: 120, stock: 10, available: true },
    { name: 'ORS', unitPrice: 30, stock: 10, available: true },
  ]);
  const prescription = await Prescription.create({
    createdBy: doctor._id,
    createdFor: patientId,
    diagnosis: 'Seasonal fever',
    medicines: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', quantity: 2 },
    ],
  });
  prescriptionId = prescription._id.toString();

  const patientLogin = await request(app).post('/api/auth/login').send({
    email: 'order.patient@test.com',
    password: 'password123',
  });
  const doctorLogin = await request(app).post('/api/auth/login').send({
    email: 'order.doctor@test.com',
    password: 'password123',
  });
  patientToken = patientLogin.body.data.token;
  doctorToken = doctorLogin.body.data.token;

  const admin = await User.create({
    name: 'Order Admin',
    email: 'order.admin@test.com',
    password: 'password123',
    role: ROLES.ADMIN,
  });
  adminToken = admin.getSignedToken();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Order.deleteMany({});
});

describe('POST /api/orders', () => {
  it('patient creates an order from a prescription', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        prescriptionId,
        shippingAddress,
        deliveryFee: 25,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderNumber).toMatch(/^ORD-/);
    expect(res.body.data.items[0].name).toBe('Paracetamol');
    expect(res.body.data.items[0].availabilityStatus).toBe('available');
    expect(res.body.data.total).toBe(95);
    orderId = res.body.data._id;
  });

  it('patient creates an order with explicit items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ name: 'Vitamin D', quantity: 2, unitPrice: 120 }],
        shippingAddress,
        discount: 20,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.subtotal).toBe(240);
    expect(res.body.data.total).toBe(220);
  });

  it('rejects unavailable medicines', async () => {
    await Medicine.create({
      name: 'Unavailable Test',
      unitPrice: 50,
      stock: 0,
      available: false,
    });
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ name: 'Unavailable Test', quantity: 1 }],
        shippingAddress,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Only available medicines/);
  });

  it('rejects doctor order creation', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        items: [{ name: 'Vitamin D', quantity: 1, unitPrice: 120 }],
        shippingAddress,
      });

    expect(res.statusCode).toBe(403);
  });

  it('rejects missing items and prescription', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ shippingAddress });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/orders', () => {
  beforeEach(async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ name: 'ORS', quantity: 1, unitPrice: 30 }],
        shippingAddress,
      });
    orderId = res.body.data._id;
  });

  it('patient lists their own orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(orderId);
  });

  it('patient retrieves their own order by id', async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(orderId);
  });

  it('rejects doctors listing orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('admin updates order and payment status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'shipped', paymentStatus: 'paid', note: 'Packed and shipped' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('shipped');
    expect(res.body.data.paymentStatus).toBe('paid');
    expect(res.body.data.statusHistory.some((entry) => entry.status === 'shipped')).toBe(true);
  });

  it('patient cancels a cancellable order', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ reason: 'No longer needed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('cancelled');
    expect(res.body.data.cancellationReason).toBe('No longer needed');
  });
});
