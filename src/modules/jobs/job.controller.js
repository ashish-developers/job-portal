const { asyncHandler } = require('../../middlewares/error.middleware');
const svc = require('./job.service');

// ── Employer ─────────────────────────────────────────────────────────────────

const create = asyncHandler(async (req, res) => {
  const data = await svc.createJob(req.employer_id, req.user_id, req.body);
  res.status(201).json({ success: true, data });
});

const listMine = asyncHandler(async (req, res) => {
  const data = await svc.getEmployerJobs(req.employer_id, req.query);
  res.json({ success: true, ...data });
});

const getOne = asyncHandler(async (req, res) => {
  const data = await svc.getJobById(req.params.id, req.employer_id);
  res.json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
  const data = await svc.updateJob(req.employer_id, req.params.id, req.body);
  res.json({ success: true, data });
});

const publish = asyncHandler(async (req, res) => {
  const data = await svc.publishJob(req.employer_id, req.params.id);
  res.json({ success: true, data });
});

const close = asyncHandler(async (req, res) => {
  await svc.closeJob(req.employer_id, req.params.id);
  res.json({ success: true, message: 'Job closed.' });
});

const remove = asyncHandler(async (req, res) => {
  await svc.deleteJob(req.employer_id, req.params.id);
  res.json({ success: true });
});

// ── Public ────────────────────────────────────────────────────────────────────

const search = asyncHandler(async (req, res) => {
  const filters = req.query;
  if (filters.skill_ids) filters.skill_ids = [].concat(filters.skill_ids).map(Number);
  const data = await svc.searchJobs(filters);
  res.json({ success: true, ...data });
});

const getBySlug = asyncHandler(async (req, res) => {
  const data = await svc.getPublicJob(req.params.slug);
  res.json({ success: true, data });
});

module.exports = { create, listMine, getOne, update, publish, close, remove, search, getBySlug };
