const { body } = require('express-validator');
const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('mobile').optional().isMobilePhone().withMessage('Invalid mobile number'),
  body('role').optional().isIn(['employer', 'seeker']).withMessage('Role must be employer or seeker'),
];

const verifyEmailRules = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
];

const resendOtpRules = [
  body('email').isEmail().normalizeEmail(),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').isEmail().normalizeEmail(),
];

const resetPasswordRules = [
  body('email').isEmail().normalizeEmail(),
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

module.exports = {
  handleValidation,
  registerRules,
  verifyEmailRules,
  resendOtpRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
};
