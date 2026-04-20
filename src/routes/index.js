const router = require('express').Router();

router.use('/auth',     require('../modules/auth/auth.routes'));
router.use('/employer', require('../modules/employer/routes/index'));
router.use('/master',   require('../modules/master/master.routes'));
router.use('/jobs',     require('../modules/jobs/job.routes'));
router.use('/seeker',   require('../modules/seeker/seeker.routes'));
router.use('/search',   require('../modules/search/search.routes'));

module.exports = router;
