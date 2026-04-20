const router = require('express').Router();
const ctrl = require('../controllers/employer.role.controller');
const { employerAuthenticate, can } = require('../../../middlewares/auth.middleware');

router.use(employerAuthenticate);

router.get('/',                           can('roles:view'),   ctrl.list);
router.post('/',                          can('roles:create'), ctrl.create);
router.put('/:id',                        can('roles:edit'),   ctrl.update);
router.delete('/:id',                     can('roles:delete'), ctrl.remove);
router.post('/:id/permissions/add',       can('roles:edit'),   ctrl.addPerms);
router.post('/:id/permissions/remove',    can('roles:edit'),   ctrl.removePerms);

module.exports = router;
