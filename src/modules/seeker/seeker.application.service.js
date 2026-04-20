const { Application, Job, Employer, SeekerProfile } = require('../../models');

const APPLICATION_STATUSES = ['applied','screening','shortlisted','interview_scheduled','offer_extended','hired','rejected','withdrawn'];

// ── Seeker actions ────────────────────────────────────────────────────────────

const apply = async (seekerId, jobId, { cover_letter, resume_url } = {}) => {
  const job = await Job.findOne({ where: { id: jobId, status: 'published' } });
  if (!job) throw Object.assign(new Error('Job not found or not accepting applications'), { status: 404 });

  const existing = await Application.findOne({ where: { job_id: jobId, seeker_id: seekerId } });
  if (existing) throw Object.assign(new Error('You have already applied to this job'), { status: 409 });

  const profile = await SeekerProfile.findOne({ where: { user_id: seekerId } });
  const resumeUrl = resume_url || profile?.resume_url;
  if (!resumeUrl) throw Object.assign(new Error('Please upload a resume before applying'), { status: 400 });

  const application = await Application.create({
    job_id: jobId, seeker_id: seekerId, cover_letter, resume_url: resumeUrl,
  });

  await job.increment('applications_count');
  return application;
};

const withdraw = async (seekerId, applicationId) => {
  const app = await Application.findOne({ where: { id: applicationId, seeker_id: seekerId } });
  if (!app) throw Object.assign(new Error('Application not found'), { status: 404 });
  if (['hired','rejected'].includes(app.status))
    throw Object.assign(new Error(`Cannot withdraw an application with status: ${app.status}`), { status: 400 });
  await app.update({ status: 'withdrawn' });
};

const getMyApplications = async (seekerId, { status, page = 1, limit = 20 } = {}) => {
  const where = { seeker_id: seekerId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;
  const { count, rows } = await Application.findAndCountAll({
    where,
    include: [{
      model: Job, as: 'job',
      attributes: ['id','title','slug','status','city_id','work_mode_id'],
      include: [{ model: Employer, as: 'employer', attributes: ['id','company_name','logo_url'] }],
    }],
    limit, offset, order: [['applied_at', 'DESC']],
  });
  return { total: count, page, limit, data: rows };
};

// ── Employer actions ──────────────────────────────────────────────────────────

const getJobApplications = async (employerId, jobId, { status, page = 1, limit = 20 } = {}) => {
  const job = await Job.findOne({ where: { id: jobId, employer_id: employerId } });
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 });

  const where = { job_id: jobId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;

  const { count, rows } = await Application.findAndCountAll({
    where,
    include: [{
      association: 'seeker',
      attributes: ['id','name','email'],
      include: [{ model: SeekerProfile, as: 'seekerProfile', attributes: ['headline','current_title','total_experience_years','resume_url','profile_photo_url'] }],
    }],
    limit, offset, order: [['applied_at', 'DESC']],
  });
  return { total: count, page, limit, data: rows };
};

const updateApplicationStatus = async (employerId, applicationId, { status, employer_notes }) => {
  const app = await Application.findOne({
    where: { id: applicationId },
    include: [{ model: Job, as: 'job', where: { employer_id: employerId } }],
  });
  if (!app) throw Object.assign(new Error('Application not found'), { status: 404 });
  if (!APPLICATION_STATUSES.includes(status))
    throw Object.assign(new Error('Invalid status'), { status: 400 });
  if (app.status === 'withdrawn')
    throw Object.assign(new Error('Cannot update a withdrawn application'), { status: 400 });

  await app.update({ status, employer_notes: employer_notes ?? app.employer_notes });
  return app.reload();
};

module.exports = { apply, withdraw, getMyApplications, getJobApplications, updateApplicationStatus };
