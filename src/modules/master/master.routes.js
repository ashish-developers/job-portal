const router = require('express').Router();
const ctrl = require('./master.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const adminOnly = [authenticate, requireRole('admin', 'super_admin')];

// List available master resource names
router.get('/', ctrl.listResources);

// Public read — active records only (pass ?all=true for admin to see inactive)
router.get('/:resource',     ctrl.getAll);
router.get('/:resource/:id', ctrl.getOne);

// Admin write operations
router.post('/:resource',        ...adminOnly, ctrl.create);
router.put('/:resource/:id',     ...adminOnly, ctrl.update);
router.delete('/:resource/:id',  ...adminOnly, ctrl.remove);

module.exports = router;
