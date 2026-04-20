const { asyncHandler } = require('../../../middlewares/error.middleware');
const svc = require('../services/employer.profile.service');

const createProfile = asyncHandler(async (req, res) => {
  const data = await svc.createProfile(req.auth.id, req.body);
  res.status(201).json({ success: true, message: 'Company profile created.', data });
});

const getProfile = asyncHandler(async (req, res) => {
  const data = await svc.getProfile(req.employer_id);
  res.json({ success: true, data });
});

const updateProfile = asyncHandler(async (req, res) => {
  const data = await svc.updateProfile(req.employer_id, req.body);
  res.json({ success: true, data });
});

const updateVerificationStatus = asyncHandler(async (req, res) => {
  const data = await svc.updateVerificationStatus(req.params.id, {
    ...req.body,
    adminId: req.auth.id,
  });
  res.json({ success: true, data });
});

module.exports = { createProfile, getProfile, updateProfile, updateVerificationStatus };
