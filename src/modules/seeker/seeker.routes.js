const router = require('express').Router();
const profileCtrl = require('./seeker.profile.controller');
const appCtrl     = require('./seeker.application.controller');
const { authenticate, requireRole, employerAuthenticate, can } = require('../../middlewares/auth.middleware');

const seekerAuth = [authenticate, requireRole('seeker')];

// ── Profile (seeker JWT) ──────────────────────────────────────────────────────
router.get('/profile',                       ...seekerAuth, profileCtrl.getProfile);
router.put('/profile',                       ...seekerAuth, profileCtrl.updateProfile);

router.post('/profile/experience',           ...seekerAuth, profileCtrl.addExperience);
router.put('/profile/experience/:id',        ...seekerAuth, profileCtrl.updateExperience);
router.delete('/profile/experience/:id',     ...seekerAuth, profileCtrl.deleteExperience);

router.post('/profile/education',            ...seekerAuth, profileCtrl.addEducation);
router.put('/profile/education/:id',         ...seekerAuth, profileCtrl.updateEducation);
router.delete('/profile/education/:id',      ...seekerAuth, profileCtrl.deleteEducation);

router.post('/profile/skills',               ...seekerAuth, profileCtrl.addSkills);
router.delete('/profile/skills/:skillId',    ...seekerAuth, profileCtrl.removeSkill);

// ── Applications (seeker) ─────────────────────────────────────────────────────
router.get('/applications',                  ...seekerAuth, appCtrl.myApps);
router.post('/applications/:jobId',          ...seekerAuth, appCtrl.apply);
router.patch('/applications/:id/withdraw',   ...seekerAuth, appCtrl.withdraw);

// ── Applications (employer sub-user) ─────────────────────────────────────────
router.get('/jobs/:jobId/applications',      employerAuthenticate, can('applications:view'),   appCtrl.jobApps);
router.patch('/applications/:id/status',     employerAuthenticate, can('applications:edit'),   appCtrl.updateStatus);

module.exports = router;
