const { asyncHandler } = require('../../middlewares/error.middleware');
const svc = require('./seeker.application.service');

// Seeker
const apply      = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.apply(req.auth.id, req.params.jobId, req.body) }));
const withdraw   = asyncHandler(async (req, res) => { await svc.withdraw(req.auth.id, req.params.id); res.json({ success: true }); });
const myApps     = asyncHandler(async (req, res) => res.json({ success: true, ...(await svc.getMyApplications(req.auth.id, req.query)) }));

// Employer
const jobApps    = asyncHandler(async (req, res) => res.json({ success: true, ...(await svc.getJobApplications(req.employer_id, req.params.jobId, req.query)) }));
const updateStatus = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateApplicationStatus(req.employer_id, req.params.id, req.body) }));

module.exports = { apply, withdraw, myApps, jobApps, updateStatus };
