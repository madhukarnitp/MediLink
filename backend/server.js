require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const { closeDatabase, connectDatabase, getDatabaseStatus } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, swaggerSpec, swaggerUiOptions } = require('./config/swagger');
const Prescription = require('./models/Prescription');
const { createPrescriptionVerificationToken } = require('./utils/prescriptionVerification');

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.disable('etag');
let server = null;

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const prescriptionRoutes = require('./routes/prescriptions');
const consultationRoutes = require('./routes/consultations');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const appointmentRoutes = require('./routes/appointments');
const vitalsRoutes = require('./routes/vitals');
const reportsRoutes = require('./routes/reports');
const aiRoutes = require('./routes/ai');

// ── CORS helpers ──────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const initializeServer = () => {
  server = http.createServer(app);
  return server;
};

// ── API documentation ────────────────────────────────────────────────────────
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please try again later' },
  skip: (req) => req.path === '/api/health',
});
app.use(limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many auth attempts — please try again in 15 minutes' },
  skip: () => process.env.NODE_ENV === 'test',
});

// ── Body & sanitization ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// API responses are cached intentionally in the frontend. Disable browser
// conditional caching so fetch never receives body-less 304 responses.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ── Request logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => console.log(msg) },
    skip: (req) => req.path === '/api/health',
  }));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    db: getDatabaseStatus(),
    environment: process.env.NODE_ENV || 'development',
  });
});


// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/ai', aiRoutes);

const redirectToPrescriptionVerification = async (req, res, next) => {
  try {
    const clientUrl = process.env.CLIENT_URL || allowedOrigins[0] || 'http://localhost:3000';
    const baseUrl = clientUrl.replace(/\/$/, '');
    const prescription = await Prescription.findById(req.params.id).select('rxId createdAt').lean();
    const token = prescription ? createPrescriptionVerificationToken(prescription) : '';
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    res.redirect(302, `${baseUrl}/#/verify/prescription/${encodeURIComponent(req.params.id)}${query}`);
  } catch (err) {
    next(err);
  }
};

app.get('/prescription/:id', redirectToPrescriptionVerification);

app.get('/verify/prescription/:id', redirectToPrescriptionVerification);

app.get('/verify/rx/:id', redirectToPrescriptionVerification);

app.get('/consultation/:id', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || allowedOrigins[0] || 'http://localhost:3000';
  res.redirect(302, `${clientUrl.replace(/\/$/, '')}/#/consultation/${encodeURIComponent(req.params.id)}`);
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`[server] ${signal} received. Starting graceful shutdown.`);

  if (server) {
    server.close(async () => {
      await closeDatabase();
      console.log('[server] HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000); // force after 10s
    return;
  }

  await closeDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error(`[process] Unhandled rejection: ${err.message}`);
  shutdown('unhandledRejection');
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5001;

if (require.main === module) {
  initializeServer();
  connectDatabase().then(() => {
    server.listen(PORT, () => {
      const env = process.env.NODE_ENV || 'development';
      console.log(`[server] MediLink API started in ${env} mode`);
      console.log(`[server] Local API: http://localhost:${PORT}/api`);
      console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[server] API docs: http://localhost:${PORT}/api-docs`);
      console.log('[server] Socket.IO is handled by the separate realtime server');
    });
  });
}

module.exports = { app, initializeServer };
