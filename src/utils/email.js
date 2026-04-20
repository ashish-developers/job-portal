const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

const FROM = `"${process.env.MAIL_FROM_NAME || 'Job Portal'}" <${process.env.MAIL_FROM_EMAIL}>`;

const send = (to, subject, html) => transporter.sendMail({ from: FROM, to, subject, html });

const sendVerificationEmail = ({ to, name, otp }) =>
  send(to, 'Verify your email', `<p>Hi ${name},</p><p>Your verification OTP is: <b>${otp}</b>. Valid for 30 minutes.</p>`);

const sendPasswordResetEmail = ({ to, name, resetLink }) =>
  send(to, 'Reset your password', `<p>Hi ${name},</p><p><a href="${resetLink}">Click here</a> to reset your password. Valid for 1 hour.</p>`);

const sendEmployerVerificationStatus = ({ to, name, status, note }) =>
  send(to, `Company verification: ${status}`,
    `<p>Hi ${name},</p><p>Your company verification status has been updated to <b>${status}</b>.</p>${note ? `<p>Note: ${note}</p>` : ''}`);

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendEmployerVerificationStatus };
