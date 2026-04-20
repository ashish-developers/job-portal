const { SeekerProfile, SeekerExperience, SeekerEducation, SeekerSkill,
        Skill, City, WorkMode, Currency, NoticePeriod, Qualification, EmploymentType } = require('../../models');

const PROFILE_INCLUDES = [
  { model: City,         as: 'city',         attributes: ['id','city_name','state'] },
  { model: WorkMode,     as: 'workMode',     attributes: ['id','label'] },
  { model: Currency,     as: 'currency',     attributes: ['id','code','symbol'] },
  { model: NoticePeriod, as: 'noticePeriod', attributes: ['id','label','days'] },
  {
    model: SeekerExperience, as: 'experiences', order: [['start_date', 'DESC']],
    include: [
      { model: EmploymentType, as: 'employmentType', attributes: ['id','label'] },
      { model: City,           as: 'city',           attributes: ['id','city_name'] },
    ],
  },
  {
    model: SeekerEducation, as: 'educations', order: [['start_year', 'DESC']],
    include: [{ model: Qualification, as: 'qualification', attributes: ['id','label'] }],
  },
  { model: Skill, as: 'skills', attributes: ['id','skill_name','skill_type'], through: { attributes: ['proficiency'] } },
];

// ── Profile ───────────────────────────────────────────────────────────────────

const getOrCreate = async (userId) => {
  const [profile] = await SeekerProfile.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  return profile.reload({ include: PROFILE_INCLUDES });
};

const updateProfile = async (userId, body) => {
  const allowed = [
    'headline','summary','current_title','total_experience_years',
    'current_salary','expected_salary','currency_id','notice_period_id',
    'city_id','work_mode_id','profile_photo_url','resume_url',
    'linkedin_url','github_url','portfolio_url','is_actively_looking',
  ];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  let profile = await SeekerProfile.findOne({ where: { user_id: userId } });
  if (!profile) profile = await SeekerProfile.create({ user_id: userId });

  await profile.update(updates);
  await profile.update({ profile_completion: calcCompletion(profile) });
  return profile.reload({ include: PROFILE_INCLUDES });
};

const calcCompletion = (p) => {
  const fields = ['headline','summary','current_title','total_experience_years','resume_url','city_id','work_mode_id'];
  const filled = fields.filter(f => p[f] != null && p[f] !== '').length;
  return Math.round((filled / fields.length) * 100);
};

// ── Experience ────────────────────────────────────────────────────────────────

const addExperience = async (userId, data) => {
  const profile = await getSeekerProfile(userId);
  return SeekerExperience.create({ ...data, seeker_id: profile.id });
};

const updateExperience = async (userId, expId, data) => {
  const profile = await getSeekerProfile(userId);
  const exp = await SeekerExperience.findOne({ where: { id: expId, seeker_id: profile.id } });
  if (!exp) throw Object.assign(new Error('Experience not found'), { status: 404 });
  await exp.update(data);
  return exp;
};

const deleteExperience = async (userId, expId) => {
  const profile = await getSeekerProfile(userId);
  const exp = await SeekerExperience.findOne({ where: { id: expId, seeker_id: profile.id } });
  if (!exp) throw Object.assign(new Error('Experience not found'), { status: 404 });
  await exp.destroy();
};

// ── Education ─────────────────────────────────────────────────────────────────

const addEducation = async (userId, data) => {
  const profile = await getSeekerProfile(userId);
  return SeekerEducation.create({ ...data, seeker_id: profile.id });
};

const updateEducation = async (userId, eduId, data) => {
  const profile = await getSeekerProfile(userId);
  const edu = await SeekerEducation.findOne({ where: { id: eduId, seeker_id: profile.id } });
  if (!edu) throw Object.assign(new Error('Education not found'), { status: 404 });
  await edu.update(data);
  return edu;
};

const deleteEducation = async (userId, eduId) => {
  const profile = await getSeekerProfile(userId);
  const edu = await SeekerEducation.findOne({ where: { id: eduId, seeker_id: profile.id } });
  if (!edu) throw Object.assign(new Error('Education not found'), { status: 404 });
  await edu.destroy();
};

// ── Skills ────────────────────────────────────────────────────────────────────

const addSkills = async (userId, skills) => {
  // skills = [{ skill_id, proficiency }]
  const profile = await getSeekerProfile(userId);
  const rows = skills.map(s => ({ seeker_id: profile.id, skill_id: s.skill_id, proficiency: s.proficiency ?? 'intermediate' }));
  await SeekerSkill.bulkCreate(rows, { ignoreDuplicates: true });
};

const removeSkill = async (userId, skillId) => {
  const profile = await getSeekerProfile(userId);
  await SeekerSkill.destroy({ where: { seeker_id: profile.id, skill_id: skillId } });
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getSeekerProfile = async (userId) => {
  const profile = await SeekerProfile.findOne({ where: { user_id: userId } });
  if (!profile) throw Object.assign(new Error('Seeker profile not found. Please create profile first.'), { status: 404 });
  return profile;
};

module.exports = {
  getOrCreate, updateProfile,
  addExperience, updateExperience, deleteExperience,
  addEducation, updateEducation, deleteEducation,
  addSkills, removeSkill,
};
