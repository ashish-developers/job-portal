const router = require('express').Router();
const ctrl = require('../controllers/employer.user.controller');
const { employerAuthenticate, can } = require('../../../middlewares/auth.middleware');

router.use(employerAuthenticate);

router.get('/',        can('users:view'),   ctrl.list);
router.post('/',       can('users:create'), ctrl.create);
router.put('/:id',     can('users:edit'),   ctrl.update);
router.delete('/:id',  can('users:delete'), ctrl.remove);

module.exports = router;
