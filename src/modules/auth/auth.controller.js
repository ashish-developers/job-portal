const { asyncHandler } = require('../../middlewares/error.middleware');
const authService = require('./auth.service');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data });
});

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.json({ success: true, message: 'Email verified successfully.' });
});

const resendOtp = asyncHandler(async (req, res) => {
  await authService.resendOtp(req.body);
  res.json({ success: true, message: 'OTP resent if email exists.' });
});

const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body);
  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  res.json({ success: true, data: { accessToken, user } });
});

const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.refreshToken;
  if (!raw) return res.status(401).json({ success: false, message: 'No refresh token' });
  const tokens = await authService.refreshTokens(raw);
  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
  res.json({ success: true, data: { accessToken: tokens.accessToken } });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies?.refreshToken);
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out.' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, message: 'Password reset successfully.' });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.auth });
});

module.exports = { register, verifyEmail, resendOtp, login, refresh, logout, forgotPassword, resetPassword, getMe };
