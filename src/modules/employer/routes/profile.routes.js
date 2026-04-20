const router = require('express').Router();
const ctrl = require('../controllers/employer.profile.controller');
const { authenticate, employerAuthenticate, requireRole } = require('../../../middlewares/auth.middleware');

// Step 2: main user (employer role, JWT from auth module) creates company profile
router.post('/', authenticate, requireRole('employer'), ctrl.createProfile);

// Sub-user routes (employer JWT)
router.get('/',   employerAuthenticate, ctrl.getProfile);
router.put('/',   employerAuthenticate, ctrl.updateProfile);

// Platform admin updates verification status
router.patch('/:id/verification', authenticate, requireRole('admin', 'super_admin'), ctrl.updateVerificationStatus);

module.exports = router;
