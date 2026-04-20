const { asyncHandler } = require('../../../middlewares/error.middleware');
const svc = require('../services/employer.user.service');

const list   = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.listUsers(req.employer_id) }));
const create = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.createUser(req.employer_id, req.body) }));
const update = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.updateUser(req.employer_id, req.params.id, req.body) }));
const remove = asyncHandler(async (req, res) => { await svc.deleteUser(req.employer_id, req.params.id); res.json({ success: true }); });

module.exports = { list, create, update, remove };
