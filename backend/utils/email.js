const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Medilink" <${process.env.EMAIL_USER}>`,
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
    console.error(`[email] Message delivery failed for ${options.to}: ${err.message}`);
    throw err;
  }
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

module.exports = { sendEmail, emailTemplates };
