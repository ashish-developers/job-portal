const router = require('express').Router();

router.use('/auth',    require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/roles',   require('./role.routes'));
router.use('/users',   require('./user.routes'));

module.exports = router;
