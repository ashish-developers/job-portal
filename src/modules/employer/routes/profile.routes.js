const router = require('express').Router();
const ctrl = require('../controllers/employer.profile.controller');
const { authenticate, employerAuthenticate, requireRole } = require('../../../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

const createRules = [
  body('company_name').notEmpty().withMessage('company_name is required'),
  body('company_email').isEmail().withMessage('Valid company_email is required'),
];

// Step 2: main user (employer role, JWT from auth module) creates company profile
router.post('/', authenticate, requireRole('employer'), createRules, validate, ctrl.createProfile);

// Sub-user routes (employer JWT)
router.get('/',   employerAuthenticate, ctrl.getProfile);
router.put('/',   employerAuthenticate, ctrl.updateProfile);

// Platform admin updates verification status
router.patch('/:id/verification', authenticate, requireRole('admin', 'super_admin'), ctrl.updateVerificationStatus);

module.exports = router;
