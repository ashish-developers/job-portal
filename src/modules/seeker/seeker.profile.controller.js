const { asyncHandler } = require('../../middlewares/error.middleware');
const svc = require('./seeker.profile.service');

const getProfile     = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.getOrCreate(req.auth.id) }));
const updateProfile  = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateProfile(req.auth.id, req.body) }));

const addExperience    = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.addExperience(req.auth.id, req.body) }));
const updateExperience = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateExperience(req.auth.id, req.params.id, req.body) }));
const deleteExperience = asyncHandler(async (req, res) => { await svc.deleteExperience(req.auth.id, req.params.id); res.json({ success: true }); });

const addEducation    = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.addEducation(req.auth.id, req.body) }));
const updateEducation = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateEducation(req.auth.id, req.params.id, req.body) }));
const deleteEducation = asyncHandler(async (req, res) => { await svc.deleteEducation(req.auth.id, req.params.id); res.json({ success: true }); });

const addSkills   = asyncHandler(async (req, res) => { await svc.addSkills(req.auth.id, req.body.skills); res.json({ success: true }); });
const removeSkill = asyncHandler(async (req, res) => { await svc.removeSkill(req.auth.id, req.params.skillId); res.json({ success: true }); });

module.exports = {
  getProfile, updateProfile,
  addExperience, updateExperience, deleteExperience,
  addEducation, updateEducation, deleteEducation,
  addSkills, removeSkill,
};
