const router = require('express').Router();
const ctrl = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const {
  handleValidation,
  registerRules, verifyEmailRules, resendOtpRules,
  loginRules, forgotPasswordRules, resetPasswordRules,
} = require('./auth.validator');

router.post('/register',        registerRules,        handleValidation, ctrl.register);
router.post('/verify-email',    verifyEmailRules,     handleValidation, ctrl.verifyEmail);
router.post('/resend-otp',      resendOtpRules,       handleValidation, ctrl.resendOtp);
router.post('/login',           loginRules,           handleValidation, ctrl.login);
router.post('/refresh',         ctrl.refresh);
router.post('/logout',          ctrl.logout);
router.post('/forgot-password', forgotPasswordRules,  handleValidation, ctrl.forgotPassword);
router.post('/reset-password',  resetPasswordRules,   handleValidation, ctrl.resetPassword);
router.get('/me',               authenticate, ctrl.getMe);

module.exports = router;
