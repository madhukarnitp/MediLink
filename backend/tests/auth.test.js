const request = require('supertest');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { app } = require('../server');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const MONGO_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/medilink_test';

jest.setTimeout(20000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
});

describe('POST /api/auth/register', () => {
  it('registers a patient successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Patient',
      email: 'testpatient@test.com',
      password: 'password123',
      role: 'patient',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeUndefined();
    expect(res.body.data.requiresVerification).toBe(true);
    expect(res.body.data.user.role).toBe('patient');
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('registers a doctor with required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Dr. Test',
      email: 'testdoctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiologist',
      qualification: 'MBBS, MD',
      regNo: 'TEST-001',
      price: 500,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.role).toBe('doctor');
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: 'dup@test.com',
      password: 'password123',
      role: 'patient',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: 'dup@test.com',
      password: 'password456',
      role: 'patient',
    });
    expect(res.statusCode).toBe(409);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad User',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(res.statusCode).toBe(422);
  });

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad User',
      email: 'bad@test.com',
      password: '123',
    });
    expect(res.statusCode).toBe(422);
  });

  it('rejects doctor without required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Incomplete Doc',
      email: 'incomplete@test.com',
      password: 'password123',
      role: 'doctor',
    });
    expect([400, 422]).toContain(res.statusCode);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'loginuser@test.com',
      password: 'password123',
      role: 'patient',
    });
    await User.updateOne(
      { email: 'loginuser@test.com' },
      { $set: { isEmailVerified: true } }
    );

    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@test.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('rejects wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'loginuser@test.com',
      password: 'password123',
      role: 'patient',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@test.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@test.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects login when email is not verified', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Unverified User',
      email: 'unverified@test.com',
      password: 'password123',
      role: 'patient',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'unverified@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/verify your email/i);
  });

  it('rejects doctor login when account approval is pending', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Pending Doctor',
      email: 'pendingdoctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiologist',
      qualification: 'MBBS, MD',
      regNo: 'PENDING-001',
      price: 700,
    });
    await User.updateOne(
      { email: 'pendingdoctor@test.com' },
      { $set: { isEmailVerified: true } }
    );

    const res = await request(app).post('/api/auth/login').send({
      email: 'pendingdoctor@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/pending admin verification/i);
  });
});

describe('Email verification flows', () => {
  it('resends a verification code for an unverified user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Verify User',
      email: 'verifyuser@test.com',
      password: 'password123',
      role: 'patient',
    });

    const res = await request(app).post('/api/auth/request-verification').send({
      email: 'verifyuser@test.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toMatch(/verification code sent/i);

    const user = await User.findOne({ email: 'verifyuser@test.com' }).lean();
    expect(user.emailVerifyToken).toBeTruthy();
    expect(user.emailVerifyCode).toBeTruthy();
  });

  it('verifies email with a numeric verification code', async () => {
    const user = await User.create({
      name: 'Code Verify',
      email: 'codeverify@test.com',
      password: 'password123',
      role: 'patient',
      emailVerifyCode: crypto.createHash('sha256').update('123456').digest('hex'),
      emailVerifyCodeExpire: Date.now() + 10 * 60 * 1000,
    });
    await Patient.create({ userId: user._id });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'codeverify@test.com',
      code: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toMatch(/verified successfully/i);

    const updated = await User.findById(user._id).lean();
    expect(updated.isEmailVerified).toBe(true);
    expect(updated.emailVerifyCode).toBeFalsy();
  });

  it('verifies email with a token link', async () => {
    const user = await User.create({
      name: 'Token Verify',
      email: 'tokenverify@test.com',
      password: 'password123',
      role: 'patient',
    });
    await Patient.create({ userId: user._id });
    const rawToken = user.generateEmailVerifyToken();
    await user.save({ validateBeforeSave: false });

    const res = await request(app).get(`/api/auth/verify-email/${rawToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toMatch(/verified successfully/i);

    const updated = await User.findById(user._id).lean();
    expect(updated.isEmailVerified).toBe(true);
    expect(updated.emailVerifyToken).toBeFalsy();
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Me User',
      email: 'meuser@test.com',
      password: 'password123',
      role: 'patient',
      isEmailVerified: true,
    });
    await Patient.create({ userId: user._id });
    token = user.getSignedToken();
  });

  it('returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe('meuser@test.com');
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
