const { asyncHandler } = require('../../middlewares/error.middleware');
const svc = require('./search.service');

// ── Job Search & Recommendations ──────────────────────────────────────────────

const searchJobs = asyncHandler(async (req, res) => {
  // Optionally score results against the caller's seeker profile
  let seekerProfile = null;
  if (req.auth?.role === 'seeker') {
    const sp = await svc.loadSeekerForScoring(req.auth.id);
    if (sp) seekerProfile = sp.toJSON();
  }
  const result = await svc.searchJobs(req.query, seekerProfile);
  res.json({ success: true, ...result });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const data = await svc.getRecommendedJobs(req.auth.id, Number(req.query.limit) || 20);
  res.json({ success: true, data });
});

const getMatchScore = asyncHandler(async (req, res) => {
  const data = await svc.getJobMatchScore(req.auth.id, req.params.jobId);
  res.json({ success: true, data });
});

// ── Saved Jobs ────────────────────────────────────────────────────────────────

const saveJob   = asyncHandler(async (req, res) => { await svc.saveJob(req.auth.id, req.params.jobId); res.json({ success: true }); });
const unsaveJob = asyncHandler(async (req, res) => { await svc.unsaveJob(req.auth.id, req.params.jobId); res.json({ success: true }); });
const savedJobs = asyncHandler(async (req, res) => res.json({ success: true, ...(await svc.getSavedJobs(req.auth.id, req.query)) }));
const checkSaved = asyncHandler(async (req, res) => res.json({ success: true, data: { saved: await svc.isSaved(req.auth.id, req.params.jobId) } }));

// ── Saved Searches ────────────────────────────────────────────────────────────

const createSavedSearch = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.createSavedSearch(req.auth.id, req.body) }));
const listSavedSearches = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.listSavedSearches(req.auth.id) }));
const deleteSavedSearch = asyncHandler(async (req, res) => { await svc.deleteSavedSearch(req.auth.id, req.params.id); res.json({ success: true }); });

// ── Job Alerts ────────────────────────────────────────────────────────────────

const createAlert = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.createAlert(req.auth.id, req.body) }));
const listAlerts  = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.listAlerts(req.auth.id) }));
const updateAlert = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateAlert(req.auth.id, req.params.id, req.body) }));
const deleteAlert = asyncHandler(async (req, res) => { await svc.deleteAlert(req.auth.id, req.params.id); res.json({ success: true }); });

// ── Candidate Search (employer) ───────────────────────────────────────────────

const searchCandidates = asyncHandler(async (req, res) => {
  const filters = { ...req.query };
  if (filters.skill_ids) filters.skill_ids = [].concat(filters.skill_ids).map(Number);
  const jobId = filters.job_id ? Number(filters.job_id) : null;
  const result = await svc.searchCandidates(req.employer_id, filters, jobId);
  res.json({ success: true, ...result });
});

const getMatchedCandidates = asyncHandler(async (req, res) => {
  const data = await svc.getMatchedCandidates(req.employer_id, req.params.jobId, Number(req.query.top) || 30);
  res.json({ success: true, data });
});

module.exports = {
  searchJobs, getRecommendations, getMatchScore,
  saveJob, unsaveJob, savedJobs, checkSaved,
  createSavedSearch, listSavedSearches, deleteSavedSearch,
  createAlert, listAlerts, updateAlert, deleteAlert,
  searchCandidates, getMatchedCandidates,
};
