const models = require('../../models');

const MASTERS = {
  industries:       { model: 'Industry',        order: [['industry_name', 'ASC']] },
  departments:      { model: 'Department',      order: [['dept_name', 'ASC']] },
  'job-roles':      { model: 'JobRole',         order: [['role_title', 'ASC']] },
  skills:           { model: 'Skill',           order: [['skill_name', 'ASC']] },
  'employment-types':  { model: 'EmploymentType',   order: [['label', 'ASC']] },
  'experience-levels': { model: 'ExperienceLevel',  order: [['min_years', 'ASC']] },
  'education-levels':  { model: 'EducationLevel',   order: [['sort_order', 'ASC']] },
  qualifications:   { model: 'Qualification',   order: [['label', 'ASC']] },
  currencies:       { model: 'Currency',        order: [['code', 'ASC']] },
  cities:           { model: 'City',            order: [['city_name', 'ASC']] },
  'work-modes':     { model: 'WorkMode',        order: [['label', 'ASC']] },
  'notice-periods': { model: 'NoticePeriod',    order: [['days', 'ASC']] },
  'company-sizes':  { model: 'CompanySize',     order: [['min_count', 'ASC']] },
};

const getAll = async (resource, { active_only = true } = {}) => {
  const cfg = MASTERS[resource];
  if (!cfg) throw Object.assign(new Error('Unknown master resource'), { status: 404 });
  const where = active_only ? { is_active: true } : {};
  return models[cfg.model].findAll({ where, order: cfg.order });
};

const getOne = async (resource, id) => {
  const cfg = MASTERS[resource];
  if (!cfg) throw Object.assign(new Error('Unknown master resource'), { status: 404 });
  const record = await models[cfg.model].findByPk(id);
  if (!record) throw Object.assign(new Error('Record not found'), { status: 404 });
  return record;
};

const create = async (resource, data) => {
  const cfg = MASTERS[resource];
  if (!cfg) throw Object.assign(new Error('Unknown master resource'), { status: 404 });
  return models[cfg.model].create(data);
};

const update = async (resource, id, data) => {
  const cfg = MASTERS[resource];
  if (!cfg) throw Object.assign(new Error('Unknown master resource'), { status: 404 });
  const record = await models[cfg.model].findByPk(id);
  if (!record) throw Object.assign(new Error('Record not found'), { status: 404 });
  await record.update(data);
  return record.reload();
};

const remove = async (resource, id) => {
  const cfg = MASTERS[resource];
  if (!cfg) throw Object.assign(new Error('Unknown master resource'), { status: 404 });
  const record = await models[cfg.model].findByPk(id);
  if (!record) throw Object.assign(new Error('Record not found'), { status: 404 });
  await record.update({ is_active: false }); // soft delete
};

module.exports = { getAll, getOne, create, update, remove, MASTER_KEYS: Object.keys(MASTERS) };
