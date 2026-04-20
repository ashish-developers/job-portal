const { Op } = require('sequelize');
const {
  Job, JobSkill, Employer, Department, JobRole, EmploymentType, ExperienceLevel,
  EducationLevel, WorkMode, City, Currency, NoticePeriod, Skill,
  SeekerProfile, SeekerExperience, SeekerSkill,
  SavedJob, SavedSearch, JobAlert,
  User,
} = require('../../models');
const { scoreJobForSeeker, annotateWithScore, matchTier } = require('./match.service');

// ── Shared includes ────────────────────────────────────────────────────────────

const JOB_INCLUDES = [
  { model: Employer,        as: 'employer',        attributes: ['id','company_name','company_slug','logo_url','verification_status'] },
  { model: Department,      as: 'department',      attributes: ['id','dept_name'] },
  { model: JobRole,         as: 'jobRole',         attributes: ['id','role_title'] },
  { model: EmploymentType,  as: 'employmentType',  attributes: ['id','label'] },
  { model: ExperienceLevel, as: 'experienceLevel', attributes: ['id','label'] },
  { model: EducationLevel,  as: 'educationLevel',  attributes: ['id','label'] },
  { model: WorkMode,        as: 'workMode',        attributes: ['id','label'] },
  { model: City,            as: 'city',            attributes: ['id','city_name','state'] },
  { model: Currency,        as: 'currency',        attributes: ['id','code','symbol'] },
  { model: NoticePeriod,    as: 'noticePeriod',    attributes: ['id','label','days'] },
  { model: Skill,           as: 'skills',          attributes: ['id','skill_name','skill_type'], through: { attributes: [] } },
];

const SEEKER_INCLUDES = [
  { model: City,         as: 'city',         attributes: ['id','city_name','state'] },
  { model: WorkMode,     as: 'workMode',     attributes: ['id','label'] },
  { model: NoticePeriod, as: 'noticePeriod', attributes: ['id','label','days'] },
  { model: Currency,     as: 'currency',     attributes: ['id','code','symbol'] },
  { model: Skill,        as: 'skills',       attributes: ['id','skill_name','skill_type'], through: { attributes: ['proficiency'] } },
];

// ── Load seeker profile with everything needed for scoring ────────────────────

const loadSeekerForScoring = async (userId) =>
  SeekerProfile.findOne({ where: { user_id: userId }, include: SEEKER_INCLUDES });

// ── Job Search ─────────────────────────────────────────────────────────────────

/**
 * Advanced job search.
 * When seekerProfile is passed, results are annotated with match scores and
 * sorted by relevance (score desc, then recency).
 */
const searchJobs = async (filters = {}, seekerProfile = null) => {
  const {
    q, city_id, work_mode_id, employment_type_id, experience_level_id,
    education_level_id, department_id, salary_min, salary_max,
    skill_ids, employer_id, verified_only = false,
    page = 1, limit = 20,
  } = filters;

  const where = { status: 'published' };

  if (q)                   where[Op.or] = [
    { title:        { [Op.like]: `%${q}%` } },
    { description:  { [Op.like]: `%${q}%` } },
    { requirements: { [Op.like]: `%${q}%` } },
  ];
  if (city_id)             where.city_id = city_id;
  if (work_mode_id)        where.work_mode_id = work_mode_id;
  if (employment_type_id)  where.employment_type_id = employment_type_id;
  if (experience_level_id) where.experience_level_id = experience_level_id;
  if (education_level_id)  where.education_level_id = education_level_id;
  if (department_id)       where.department_id = department_id;
  if (employer_id)         where.employer_id = employer_id;
  if (salary_min)          where.salary_max = { [Op.gte]: Number(salary_min) };
  if (salary_max)          where.salary_min = { [Op.lte]: Number(salary_max) };

  const include = JOB_INCLUDES.map(inc => ({ ...inc }));

  // Skill filter at DB level
  if (skill_ids?.length) {
    const skillInc = include.find(i => i.as === 'skills');
    skillInc.where    = { id: { [Op.in]: skill_ids.map(Number) } };
    skillInc.required = true;
  }

  // Only show verified employers
  if (verified_only) {
    const empInc = include.find(i => i.as === 'employer');
    empInc.where    = { verification_status: 'VERIFIED' };
    empInc.required = true;
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await Job.findAndCountAll({
    where, include, limit: Number(limit), offset, distinct: true,
    order: [['published_at', 'DESC']],
  });

  let data = rows;

  // Annotate with match scores when seeker profile is available
  if (seekerProfile) {
    data = annotateWithScore(rows, (job) => scoreJobForSeeker(seekerProfile, job));
  }

  return { total: count, page: Number(page), limit: Number(limit), data };
};

// ── Recommendations for a seeker (top 20 best-matched published jobs) ──────────

const getRecommendedJobs = async (userId, limit = 20) => {
  const seeker = await loadSeekerForScoring(userId);
  if (!seeker) throw Object.assign(new Error('Complete your seeker profile to get recommendations'), { status: 400 });

  // Fetch recent published jobs (max 200 to score in memory)
  const jobs = await Job.findAll({
    where: { status: 'published' },
    include: JOB_INCLUDES,
    order: [['published_at', 'DESC']],
    limit: 200,
  });

  const scored = annotateWithScore(jobs, (job) => scoreJobForSeeker(seeker, job));
  return scored.slice(0, limit);
};

// ── Single job match score for a seeker ────────────────────────────────────────

const getJobMatchScore = async (userId, jobId) => {
  const [seeker, job] = await Promise.all([
    loadSeekerForScoring(userId),
    Job.findOne({ where: { id: jobId, status: 'published' }, include: JOB_INCLUDES }),
  ]);
  if (!seeker) throw Object.assign(new Error('Seeker profile not found'), { status: 404 });
  if (!job)    throw Object.assign(new Error('Job not found'), { status: 404 });

  const jobData    = job.toJSON();
  const seekerData = seeker.toJSON();
  const score      = scoreJobForSeeker(seekerData, jobData);

  return {
    job_id: job.id,
    match_score: score,
    match_tier: matchTier(score),
    breakdown: buildBreakdown(seekerData, jobData),
  };
};

const buildBreakdown = (seeker, job) => {
  const jobSkillIds  = new Set((job.skills  || []).map(s => s.id));
  const seekSkillIds = new Set((seeker.skills || []).map(s => s.id));
  const matchedSkills = (job.skills || []).filter(s => seekSkillIds.has(s.id));
  const missingSkills = (job.skills || []).filter(s => !seekSkillIds.has(s.id));

  return {
    skills:        { matched: matchedSkills.map(s => s.skill_name), missing: missingSkills.map(s => s.skill_name) },
    experience:    { required_min: job.min_experience, required_max: job.max_experience, seeker_has: seeker.total_experience_years },
    location:      { job_city: job.city?.city_name, seeker_city: seeker.city?.city_name, job_work_mode: job.workMode?.label },
    salary:        { job_min: job.salary_min, job_max: job.salary_max, seeker_expected: seeker.expected_salary },
    notice_period: { job_requires: job.noticePeriod?.label, seeker_has: seeker.noticePeriod?.label },
  };
};

// ── Candidate Search (employer-facing) ────────────────────────────────────────

const searchCandidates = async (employerId, filters = {}, jobId = null) => {
  const {
    skill_ids, city_id, work_mode_id, notice_period_id,
    min_experience, max_experience, is_actively_looking = true,
    page = 1, limit = 20,
  } = filters;

  const where = {};
  if (is_actively_looking !== undefined) where.is_actively_looking = is_actively_looking === 'false' ? false : Boolean(is_actively_looking);
  if (city_id)            where.city_id = city_id;
  if (work_mode_id)       where.work_mode_id = work_mode_id;
  if (notice_period_id)   where.notice_period_id = notice_period_id;
  if (min_experience)     where.total_experience_years = { ...(where.total_experience_years || {}), [Op.gte]: Number(min_experience) };
  if (max_experience)     where.total_experience_years = { ...(where.total_experience_years || {}), [Op.lte]: Number(max_experience) };

  const include = [...SEEKER_INCLUDES];

  if (skill_ids?.length) {
    const skillInc = include.find(i => i.as === 'skills');
    skillInc.where    = { id: { [Op.in]: skill_ids.map(Number) } };
    skillInc.required = true;
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await SeekerProfile.findAndCountAll({
    where, include, limit: Number(limit), offset, distinct: true,
  });

  let data = rows;

  // If a specific job is provided, score candidates against it
  if (jobId) {
    const job = await Job.findOne({ where: { id: jobId, employer_id: employerId }, include: JOB_INCLUDES });
    if (job) {
      const jobData = job.toJSON();
      data = annotateWithScore(rows, (seeker) => scoreJobForSeeker(seeker, jobData));
    }
  }

  return { total: count, page: Number(page), limit: Number(limit), data };
};

// ── Top matched candidates for a job ──────────────────────────────────────────

const getMatchedCandidates = async (employerId, jobId, topN = 30) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId }, include: JOB_INCLUDES });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });

  const seekers = await SeekerProfile.findAll({
    where: { is_actively_looking: true },
    include: SEEKER_INCLUDES,
    limit: 300,
  });

  const jobData = job.toJSON();
  const scored  = annotateWithScore(seekers, (s) => scoreJobForSeeker(s, jobData));
  return scored.slice(0, topN);
};

// ── Saved Jobs ────────────────────────────────────────────────────────────────

const saveJob = async (userId, jobId) => {
  const job = await Job.findOne({ where: { id: jobId, status: 'published' } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });
  await SavedJob.findOrCreate({ where: { user_id: userId, job_id: jobId } });
};

const unsaveJob = async (userId, jobId) => {
  await SavedJob.destroy({ where: { user_id: userId, job_id: jobId } });
};

const getSavedJobs = async (userId, { page = 1, limit = 20 } = {}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await SavedJob.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: Job, as: 'job', include: JOB_INCLUDES }],
    limit: Number(limit), offset,
    order: [['created_at', 'DESC']],
  });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const isSaved = async (userId, jobId) => !!(await SavedJob.findOne({ where: { user_id: userId, job_id: jobId } }));

// ── Saved Searches ────────────────────────────────────────────────────────────

const createSavedSearch = async (userId, { name, filters }) => {
  return SavedSearch.create({ user_id: userId, name, filters });
};

const listSavedSearches = async (userId) => {
  return SavedSearch.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
};

const deleteSavedSearch = async (userId, id) => {
  const record = await SavedSearch.findOne({ where: { id, user_id: userId } });
  if (!record) throw Object.assign(new Error('Saved search not found'), { status: 404 });
  await record.destroy();
};

// ── Job Alerts ────────────────────────────────────────────────────────────────

const createAlert = async (userId, { name, filters, frequency = 'daily' }) => {
  return JobAlert.create({ user_id: userId, name, filters, frequency });
};

const listAlerts = async (userId) => {
  return JobAlert.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
};

const updateAlert = async (userId, id, { name, filters, frequency, is_active }) => {
  const alert = await JobAlert.findOne({ where: { id, user_id: userId } });
  if (!alert) throw Object.assign(new Error('Alert not found'), { status: 404 });
  await alert.update({ name, filters, frequency, is_active });
  return alert;
};

const deleteAlert = async (userId, id) => {
  const alert = await JobAlert.findOne({ where: { id, user_id: userId } });
  if (!alert) throw Object.assign(new Error('Alert not found'), { status: 404 });
  await alert.destroy();
};

/**
 * Find active alerts whose filters match newly published jobs.
 * Called by a job publish event or a scheduled cron.
 * Returns [{ alert, matchingJobs[] }]
 */
const processAlertsForJob = async (job) => {
  const alerts = await JobAlert.findAll({ where: { is_active: true } });
  const results = [];

  for (const alert of alerts) {
    const f = alert.filters;
    const match =
      (!f.q                   || job.title.toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.city_id             || job.city_id === f.city_id) &&
      (!f.work_mode_id        || job.work_mode_id === f.work_mode_id) &&
      (!f.employment_type_id  || job.employment_type_id === f.employment_type_id) &&
      (!f.department_id       || job.department_id === f.department_id);

    if (match) results.push(alert);
  }
  return results;
};

module.exports = {
  loadSeekerForScoring,
  searchJobs, getRecommendedJobs, getJobMatchScore,
  searchCandidates, getMatchedCandidates,
  saveJob, unsaveJob, getSavedJobs, isSaved,
  createSavedSearch, listSavedSearches, deleteSavedSearch,
  createAlert, listAlerts, updateAlert, deleteAlert, processAlertsForJob,
};
