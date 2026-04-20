const { asyncHandler } = require('../../../middlewares/error.middleware');
const svc = require('../services/employer.auth.service');

const login = asyncHandler(async (req, res) => {
  const data = await svc.login(req.body);
  res.json({ success: true, data });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await svc.forgotPassword(req.body);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await svc.resetPassword(req.body);
  res.json({ success: true, message: 'Password reset successfully.' });
});

const getMe = asyncHandler(async (req, res) => {
  const data = await svc.getMe(req.user_id);
  res.json({ success: true, data });
});

module.exports = { login, forgotPassword, resetPassword, getMe };
