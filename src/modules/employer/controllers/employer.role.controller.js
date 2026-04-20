const { asyncHandler } = require('../../../middlewares/error.middleware');
const svc = require('../services/employer.role.service');

const list    = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.listRoles(req.employer_id) }));
const create  = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.createRole(req.employer_id, req.body) }));
const update  = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateRole(req.employer_id, req.params.id, req.body) }));
const remove  = asyncHandler(async (req, res) => { await svc.deleteRole(req.employer_id, req.params.id); res.json({ success: true }); });
const addPerms    = asyncHandler(async (req, res) => { await svc.addPermissions(req.employer_id, req.params.id, req.body.permission_ids); res.json({ success: true }); });
const removePerms = asyncHandler(async (req, res) => { await svc.removePermissions(req.employer_id, req.params.id, req.body.permission_ids); res.json({ success: true }); });

module.exports = { list, create, update, remove, addPerms, removePerms };
