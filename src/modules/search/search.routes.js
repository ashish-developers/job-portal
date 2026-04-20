const router = require('express').Router();
const ctrl = require('./search.controller');
const { authenticate, requireRole, employerAuthenticate } = require('../../middlewares/auth.middleware');

// authenticate is optional on public routes — attach if token present, else skip
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  const jwt = require('jsonwebtoken');
  try {
    req.auth = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch { /* expired/invalid — treat as unauthenticated */ }
  next();
};

const seekerAuth    = [authenticate, requireRole('seeker')];

// ── Public / optional-auth ────────────────────────────────────────────────────
router.get('/jobs',              optionalAuth, ctrl.searchJobs);

// ── Seeker authenticated ──────────────────────────────────────────────────────
router.get('/jobs/recommendations',        ...seekerAuth, ctrl.getRecommendations);
router.get('/jobs/:jobId/match-score',     ...seekerAuth, ctrl.getMatchScore);

router.post('/saved-jobs/:jobId',          ...seekerAuth, ctrl.saveJob);
router.delete('/saved-jobs/:jobId',        ...seekerAuth, ctrl.unsaveJob);
router.get('/saved-jobs',                  ...seekerAuth, ctrl.savedJobs);
router.get('/saved-jobs/:jobId/is-saved',  ...seekerAuth, ctrl.checkSaved);

router.post('/saved-searches',             ...seekerAuth, ctrl.createSavedSearch);
router.get('/saved-searches',              ...seekerAuth, ctrl.listSavedSearches);
router.delete('/saved-searches/:id',       ...seekerAuth, ctrl.deleteSavedSearch);

router.post('/job-alerts',                 ...seekerAuth, ctrl.createAlert);
router.get('/job-alerts',                  ...seekerAuth, ctrl.listAlerts);
router.patch('/job-alerts/:id',            ...seekerAuth, ctrl.updateAlert);
router.delete('/job-alerts/:id',           ...seekerAuth, ctrl.deleteAlert);

// ── Employer authenticated ────────────────────────────────────────────────────
router.get('/candidates',                  employerAuthenticate, ctrl.searchCandidates);
router.get('/candidates/for-job/:jobId',   employerAuthenticate, ctrl.getMatchedCandidates);

module.exports = router;
