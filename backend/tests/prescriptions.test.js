const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Prescription = require('../models/Prescription');

const MONGO_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/medilink_test';

jest.setTimeout(20000);

let patientToken, doctorToken, patientId, prescriptionId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  const pr = await request(app).post('/api/auth/register').send({
    name: 'Presc Patient',
    email: 'prescpt@test.com',
    password: 'password123',
    role: 'patient',
  });
  const patientUser = pr.body.data.user;
  const patientProfile = await Patient.findOne({ userId: patientUser._id });
  patientId = patientProfile._id.toString();

  const dr = await request(app).post('/api/auth/register').send({
    name: 'Dr. Presc',
    email: 'prescdr@test.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'General Physician',
    qualification: 'MBBS',
    regNo: 'PRESC-DR-001',
    price: 400,
  });

  await User.updateMany(
    { email: { $in: ['prescpt@test.com', 'prescdr@test.com'] } },
    { isEmailVerified: true }
  );
  await Doctor.findOneAndUpdate(
    { userId: dr.body.data.user._id },
    { isVerified: true, online: true }
  );

  const patientLogin = await request(app).post('/api/auth/login').send({
    email: 'prescpt@test.com',
    password: 'password123',
  });
  const doctorLogin = await request(app).post('/api/auth/login').send({
    email: 'prescdr@test.com',
    password: 'password123',
  });
  patientToken = patientLogin.body.data.token;
  doctorToken = doctorLogin.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/prescriptions', () => {
  it('doctor creates a prescription', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        patientId,
        diagnosis: 'Common Cold',
        symptoms: ['Runny nose', 'Sore throat'],
        medicines: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'Thrice daily', duration: '5 days' },
          { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' },
        ],
        advice: 'Rest and hydrate',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.diagnosis).toBe('Common Cold');
    expect(res.body.data.rxId).toBeDefined();
    prescriptionId = res.body.data._id;
  });

  it('patient cannot create prescriptions', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ patientId, diagnosis: 'Cold', medicines: [] });
    expect(res.statusCode).toBe(403);
  });

  it('rejects missing medicines', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ patientId, diagnosis: 'Cold', medicines: [] });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('rejects missing diagnosis', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        patientId,
        medicines: [{ name: 'Drug', dosage: '10mg', frequency: 'Daily', duration: '5 days' }],
      });
    expect(res.statusCode).toBe(422);
  });
});

describe('GET /api/prescriptions/:id', () => {
  it('doctor retrieves their prescription', async () => {
    if (!prescriptionId) return;
    const res = await request(app)
      .get(`/api/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${doctorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(prescriptionId);
  });
});

describe('GET /api/prescriptions/verify/:id', () => {
  it('verifies a prescription without authentication', async () => {
    if (!prescriptionId) return;
    const res = await request(app).get(`/api/prescriptions/verify/${prescriptionId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(prescriptionId);
    expect(res.body.data.verification.verified).toBe(true);
    expect(res.body.data.createdFor.userId.email).toBeUndefined();
  });
});

describe('PUT /api/prescriptions/:id/status', () => {
  it('doctor updates prescription status to expired', async () => {
    if (!prescriptionId) return;
    const res = await request(app)
      .put(`/api/prescriptions/${prescriptionId}/status`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ status: 'expired' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('expired');
  });

  it('rejects invalid status', async () => {
    if (!prescriptionId) return;
    const res = await request(app)
      .put(`/api/prescriptions/${prescriptionId}/status`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ status: 'invalid_status' });
    expect(res.statusCode).toBe(422);
  });
});

describe('GET /api/patients/prescriptions', () => {
  it('patient retrieves their prescriptions', async () => {
    const res = await request(app)
      .get('/api/patients/prescriptions')
      .set('Authorization', `Bearer ${patientToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns 403 for doctors', async () => {
    const res = await request(app)
      .get('/api/patients/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`);
    expect(res.statusCode).toBe(403);
  });
});
