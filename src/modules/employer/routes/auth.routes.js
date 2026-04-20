const router = require('express').Router();
const ctrl = require('../controllers/employer.auth.controller');
const { employerAuthenticate } = require('../../../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, ctrl.login);

router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], validate, ctrl.forgotPassword);

router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
], validate, ctrl.resetPassword);

router.get('/me', employerAuthenticate, ctrl.getMe);

module.exports = router;
