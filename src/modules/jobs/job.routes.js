const router = require('express').Router();
const ctrl = require('./job.controller');
const { employerAuthenticate, can } = require('../../middlewares/auth.middleware');
const { handle, createRules, updateRules, searchRules } = require('./job.validator');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/search',       searchRules, handle, ctrl.search);
router.get('/view/:slug',   ctrl.getBySlug);

// ── Employer (sub-user JWT) ───────────────────────────────────────────────────
router.use(employerAuthenticate);

router.get('/',              can('jobs:view'),   ctrl.listMine);
router.post('/',             can('jobs:create'), createRules, handle, ctrl.create);
router.get('/:id',           can('jobs:view'),   ctrl.getOne);
router.put('/:id',           can('jobs:edit'),   updateRules, handle, ctrl.update);
router.patch('/:id/publish', can('jobs:edit'),   ctrl.publish);
router.patch('/:id/close',   can('jobs:edit'),   ctrl.close);
router.delete('/:id',        can('jobs:delete'), ctrl.remove);

module.exports = router;
