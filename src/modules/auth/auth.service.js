const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, RefreshToken } = require('../../models');
const { generateAccessToken, generateRefreshToken, hashToken, generateOtp } = require('../../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../../utils/email');

const BCRYPT_ROUNDS = 12;

const buildTokenPair = async (user) => {
  const payload = { id: user.id, role: user.role, status: user.status };
  const accessToken  = generateAccessToken(payload);
  const rawRefresh   = generateRefreshToken();
  const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    user_id:    user.id,
    token_hash: hashToken(rawRefresh),
    expires_at: refreshExpires,
  });

  return { accessToken, refreshToken: rawRefresh };
};

// Step 1: create user account, send OTP
const register = async ({ name, email, password, mobile, role = 'employer' }) => {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const otp    = generateOtp();
  const otpExp = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  const user = await User.create({
    name, email, password: hashed, mobile, role,
    status:               role === 'employer' ? 'pending_profile' : 'active',
    email_verified:       false,
    email_verify_token:   otp,
    email_verify_expires: otpExp,
  });

  await sendVerificationEmail({ to: email, name, otp });

  return { id: user.id, email: user.email, role: user.role, status: user.status };
};

// Verify email with OTP
const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({
    where: {
      email,
      email_verify_token:   otp,
      email_verify_expires: { [Op.gt]: new Date() },
    },
  });
  if (!user) throw Object.assign(new Error('OTP is invalid or expired'), { status: 400 });

  await user.update({ email_verified: true, email_verify_token: null, email_verify_expires: null,
    ...(user.status === 'pending_profile' ? {} : { status: 'active' }) });
  return true;
};

// Resend OTP
const resendOtp = async ({ email }) => {
  const user = await User.findOne({ where: { email, email_verified: false } });
  if (!user) return; // silent
  const otp    = generateOtp();
  await user.update({ email_verify_token: otp, email_verify_expires: new Date(Date.now() + 30 * 60 * 1000) });
  await sendVerificationEmail({ to: email, name: user.name, otp });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.email_verified) throw Object.assign(new Error('Please verify your email first'), { status: 403 });
  if (user.status === 'suspended') throw Object.assign(new Error('Account suspended'), { status: 403 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const tokens = await buildTokenPair(user);
  return {
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
  };
};

// Exchange refresh token for new access token
const refreshTokens = async (rawRefreshToken) => {
  const hash = hashToken(rawRefreshToken);
  const record = await RefreshToken.findOne({
    where: { token_hash: hash, is_revoked: false, expires_at: { [Op.gt]: new Date() } },
    include: [{ association: 'user' }],
  });
  if (!record) throw Object.assign(new Error('Refresh token is invalid or expired'), { status: 401 });

  await record.update({ is_revoked: true }); // rotate

  return buildTokenPair(record.user);
};

const logout = async (rawRefreshToken) => {
  if (!rawRefreshToken) return;
  await RefreshToken.update({ is_revoked: true }, { where: { token_hash: hashToken(rawRefreshToken) } });
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return; // silent — prevent enumeration
  const raw  = generateRefreshToken();
  const exp  = new Date(Date.now() + 60 * 60 * 1000);
  await user.update({ email_verify_token: hashToken(raw), email_verify_expires: exp });
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${raw}&email=${email}`;
  await sendPasswordResetEmail({ to: email, name: user.name, resetLink: link });
};

const resetPassword = async ({ email, token, password }) => {
  const user = await User.findOne({
    where: { email, email_verify_token: hashToken(token), email_verify_expires: { [Op.gt]: new Date() } },
  });
  if (!user) throw Object.assign(new Error('Token invalid or expired'), { status: 400 });
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await user.update({ password: hashed, email_verify_token: null, email_verify_expires: null });
  // revoke all refresh tokens
  await RefreshToken.update({ is_revoked: true }, { where: { user_id: user.id } });
};

module.exports = { register, verifyEmail, resendOtp, login, refreshTokens, logout, forgotPassword, resetPassword };
