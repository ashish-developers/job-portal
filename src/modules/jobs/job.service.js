const { Op } = require('sequelize');
const { Job, JobSkill, Employer, Department, JobRole, EmploymentType,
        ExperienceLevel, EducationLevel, WorkMode, City, Currency, NoticePeriod, Skill } = require('../../models');

// Auto-generate unique slug from title + employer_id
const makeSlug = async (title, employerId) => {
  const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let slug = `${base}-${employerId}`;
  let n = 0;
  while (await Job.findOne({ where: { slug } })) {
    n++;
    slug = `${base}-${employerId}-${n}`;
  }
  return slug;
};

const JOB_INCLUDES = [
  { model: Employer,       as: 'employer',       attributes: ['id','company_name','company_slug','logo_url'] },
  { model: Department,     as: 'department',     attributes: ['id','dept_name'] },
  { model: JobRole,        as: 'jobRole',        attributes: ['id','role_title'] },
  { model: EmploymentType, as: 'employmentType', attributes: ['id','label'] },
  { model: ExperienceLevel,as: 'experienceLevel',attributes: ['id','label'] },
  { model: EducationLevel, as: 'educationLevel', attributes: ['id','label'] },
  { model: WorkMode,       as: 'workMode',       attributes: ['id','label'] },
  { model: City,           as: 'city',           attributes: ['id','city_name','state'] },
  { model: Currency,       as: 'currency',       attributes: ['id','code','symbol'] },
  { model: NoticePeriod,   as: 'noticePeriod',   attributes: ['id','label'] },
  { model: Skill,          as: 'skills',         attributes: ['id','skill_name','skill_type'], through: { attributes: [] } },
];

// ── Employer-facing ──────────────────────────────────────────────────────────

const createJob = async (employerId, createdBy, body) => {
  const { skill_ids = [], ...fields } = body;
  const slug = await makeSlug(fields.title, employerId);
  const job = await Job.create({ ...fields, employer_id: employerId, created_by: createdBy, slug });

  if (skill_ids.length) {
    await JobSkill.bulkCreate(skill_ids.map(sid => ({ job_id: job.id, skill_id: sid })), { ignoreDuplicates: true });
  }
  return job.reload({ include: JOB_INCLUDES });
};

const getEmployerJobs = async (employerId, { status, page = 1, limit = 20 } = {}) => {
  const where = { employer_id: employerId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;
  const { count, rows } = await Job.findAndCountAll({ where, include: JOB_INCLUDES, limit, offset, order: [['created_at', 'DESC']] });
  return { total: count, page, limit, data: rows };
};

const getJobById = async (id, employerId = null) => {
  const where = { id };
  if (employerId) where.employer_id = employerId;
  const job = await Job.findOne({ where, include: JOB_INCLUDES });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  return job;
};

const updateJob = async (employerId, jobId, body) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  if (job.status === 'closed') throw Object.assign(new Error('Cannot edit a closed job'), { status: 400 });

  const { skill_ids, ...fields } = body;
  await job.update(fields);

  if (skill_ids !== undefined) {
    await JobSkill.destroy({ where: { job_id: jobId } });
    if (skill_ids.length) {
      await JobSkill.bulkCreate(skill_ids.map(sid => ({ job_id: jobId, skill_id: sid })), { ignoreDuplicates: true });
    }
  }
  return job.reload({ include: JOB_INCLUDES });
};

const publishJob = async (employerId, jobId) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  if (!['draft','paused'].includes(job.status)) throw Object.assign(new Error(`Cannot publish a job with status: ${job.status}`), { status: 400 });
  await job.update({ status: 'published', published_at: job.published_at ?? new Date() });
  return job;
};

const closeJob = async (employerId, jobId) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  await job.update({ status: 'closed' });
};

const deleteJob = async (employerId, jobId) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  if (job.status === 'published') throw Object.assign(new Error('Close the job before deleting'), { status: 400 });
  await job.destroy();
};

// ── Public-facing (job search) ───────────────────────────────────────────────

const searchJobs = async ({
  q, city_id, work_mode_id, employment_type_id, experience_level_id,
  salary_min, salary_max, department_id, skill_ids,
  page = 1, limit = 20,
} = {}) => {
  const where = { status: 'published' };

  if (q)                   where.title = { [Op.like]: `%${q}%` };
  if (city_id)             where.city_id = city_id;
  if (work_mode_id)        where.work_mode_id = work_mode_id;
  if (employment_type_id)  where.employment_type_id = employment_type_id;
  if (experience_level_id) where.experience_level_id = experience_level_id;
  if (department_id)       where.department_id = department_id;
  if (salary_min)          where.salary_max = { [Op.gte]: salary_min };
  if (salary_max)          where.salary_min = { [Op.lte]: salary_max };

  const include = [...JOB_INCLUDES];
  if (skill_ids?.length) {
    const skillInclude = include.find(i => i.as === 'skills');
    skillInclude.where = { id: { [Op.in]: skill_ids } };
    skillInclude.required = true;
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Job.findAndCountAll({
    where, include, limit, offset, distinct: true,
    order: [['published_at', 'DESC']],
  });
  return { total: count, page, limit, data: rows };
};

const getPublicJob = async (slug) => {
  const job = await Job.findOne({ where: { slug, status: 'published' }, include: JOB_INCLUDES });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  await job.increment('views_count');
  return job;
};

module.exports = { createJob, getEmployerJobs, getJobById, updateJob, publishJob, closeJob, deleteJob, searchJobs, getPublicJob };
