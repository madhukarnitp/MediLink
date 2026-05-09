const nodemailer = require('nodemailer');

const parseBool = (value) => String(value || '').toLowerCase() === 'true';

const getTimeout = (name, fallback) => {
  const value = parseInt(process.env[name], 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const getEmailConfig = () => {
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  return {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: parseBool(process.env.EMAIL_SECURE) || port === 465,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || `"Medilink" <${process.env.EMAIL_USER}>`,
    required: parseBool(process.env.EMAIL_REQUIRED),
    family: 4,
    connectionTimeout: getTimeout('EMAIL_CONNECTION_TIMEOUT_MS', 8000),
    greetingTimeout: getTimeout('EMAIL_GREETING_TIMEOUT_MS', 8000),
    socketTimeout: getTimeout('EMAIL_SOCKET_TIMEOUT_MS', 10000),
  };
};

const getSafeEmailError = (err) => ({
  code: err?.code,
  command: err?.command,
  responseCode: err?.responseCode,
  message: err?.message,
});

const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    family: config.family,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
  });
};

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async (options) => {
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_EMAIL === 'true') {
    return { messageId: `email-disabled-${Date.now()}`, accepted: [options.to] };
  }

  const config = getEmailConfig();
  const missing = ['host', 'user', 'pass'].filter((key) => !config[key]);
  if (missing.length) {
    const message = `Email is not configured; missing ${missing.join(', ')}`;
    if (config.required || process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
    console.warn(`[email] ${message}. Skipping email to ${options.to}.`);
    return { messageId: `email-skipped-${Date.now()}`, accepted: [], skipped: true };
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[email] Message delivered to ${options.to}; id=${info.messageId}`);
    return info;
  } catch (err) {
    console.error('[email] Message delivery failed', {
      to: options.to,
      subject: options.subject,
      error: getSafeEmailError(err),
    });
    throw err;
  }
};

const sendEmailInBackground = (options, context = 'email') => {
  setImmediate(() => {
    sendEmail(options).catch((err) => {
      console.warn(`[${context}] Background email delivery failed`, {
        to: options.to,
        subject: options.subject,
        error: getSafeEmailError(err),
      });
    });
  });

  return { queued: true, to: options.to };
};

const emailTemplates = {
  verifyEmail: (name, verifyUrl, verificationCode) => ({
    subject: 'Verify your Medilink email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#0d9488;">Welcome to Medilink, ${name}!</h2>
        <p>Please verify your email address to get started.</p>
        <p style="margin:18px 0 6px;font-size:13px;color:#475569;">Verification code</p>
        <div style="display:inline-block;margin-bottom:12px;padding:12px 18px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;color:#0f172a;font-size:28px;font-weight:700;letter-spacing:0.28em;">
          ${verificationCode}
        </div>
        <p style="color:#475569;font-size:13px;line-height:1.6;margin-bottom:0;">
          You can enter this code in the MediLink verification screen, or use the button below.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#0d9488;color:white;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
        <p style="color:#666;font-size:13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
    text: `Welcome to Medilink! Your verification code is ${verificationCode}. Verify your email here: ${verifyUrl}`,
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Reset your Medilink password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#0d9488;">Password Reset Request</h2>
        <p>Hi ${name}, you requested to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#0d9488;color:white;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p style="color:#666;font-size:13px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  }),

  prescriptionCreated: (patientName, doctorName, diagnosis) => ({
    subject: 'New Prescription from Medilink',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#0d9488;">New Prescription</h2>
        <p>Hi ${patientName}, Dr. ${doctorName} has issued a prescription for: <strong>${diagnosis}</strong>.</p>
        <p>Log in to your Medilink account to view full details.</p>
      </div>
    `,
    text: `Dr. ${doctorName} issued a prescription for ${diagnosis}. Log in to view it.`,
  }),

  consultationStarted: (name, doctorName) => ({
    subject: 'Your consultation has started',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#0d9488;">Consultation Started</h2>
        <p>Hi ${name}, your consultation with Dr. ${doctorName} is now active. Log in to chat.</p>
      </div>
    `,
    text: `Your consultation with Dr. ${doctorName} has started.`,
  }),
};

module.exports = { sendEmail, sendEmailInBackground, emailTemplates };
