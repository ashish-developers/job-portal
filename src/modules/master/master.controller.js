const { asyncHandler } = require('../../middlewares/error.middleware');
const svc = require('./master.service');

const getAll = asyncHandler(async (req, res) => {
  const data = await svc.getAll(req.params.resource, { active_only: req.query.all !== 'true' });
  res.json({ success: true, data });
});

const getOne = asyncHandler(async (req, res) => {
  const data = await svc.getOne(req.params.resource, req.params.id);
  res.json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await svc.create(req.params.resource, req.body);
  res.status(201).json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
  const data = await svc.update(req.params.resource, req.params.id, req.body);
  res.json({ success: true, data });
});

const remove = asyncHandler(async (req, res) => {
  await svc.remove(req.params.resource, req.params.id);
  res.json({ success: true, message: 'Deactivated.' });
});

const listResources = (req, res) => res.json({ success: true, data: svc.MASTER_KEYS });

module.exports = { getAll, getOne, create, update, remove, listResources };
