const sequelize = require('../config/database');

// Core
const User           = require('./user.model');
const RefreshToken   = require('./refreshToken.model');
const Employer       = require('./employer.model');
const EmployerUser   = require('./employerUser.model');
const EmployerRole   = require('./employerRole.model');
const Permission     = require('./permission.model');
const RolePermission = require('./rolePermission.model');

// Masters
const Industry       = require('./masters/industry.model');
const Department     = require('./masters/department.model');
const JobRole        = require('./masters/jobRole.model');
const Skill          = require('./masters/skill.model');
const EmploymentType = require('./masters/employmentType.model');
const ExperienceLevel= require('./masters/experienceLevel.model');
const EducationLevel = require('./masters/educationLevel.model');
const Qualification  = require('./masters/qualification.model');
const Currency       = require('./masters/currency.model');
const City           = require('./masters/city.model');
const WorkMode       = require('./masters/workMode.model');
const NoticePeriod   = require('./masters/noticePeriod.model');
const CompanySize    = require('./masters/companySize.model');

// Jobs
const Job            = require('./job.model');
const JobSkill       = require('./jobSkill.model');

// Seeker
const SeekerProfile    = require('./seekerProfile.model');
const SeekerExperience = require('./seekerExperience.model');
const SeekerEducation  = require('./seekerEducation.model');
const SeekerSkill      = require('./seekerSkill.model');
const Application      = require('./application.model');

// Search
const SavedJob    = require('./savedJob.model');
const SavedSearch = require('./savedSearch.model');
const JobAlert    = require('./jobAlert.model');

// ── Associations ────────────────────────────────────────────────────────────

// User ↔ RefreshToken
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User ↔ Employer (one-to-one)
User.hasOne(Employer, { foreignKey: 'user_id', as: 'employer' });
Employer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User ↔ SeekerProfile (one-to-one)
User.hasOne(SeekerProfile, { foreignKey: 'user_id', as: 'seekerProfile' });
SeekerProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Employer ↔ EmployerUser
Employer.hasMany(EmployerUser, { foreignKey: 'employer_id', as: 'users' });
EmployerUser.belongsTo(Employer, { foreignKey: 'employer_id', as: 'employer' });

// Employer ↔ EmployerRole
Employer.hasMany(EmployerRole, { foreignKey: 'employer_id', as: 'roles' });
EmployerRole.belongsTo(Employer, { foreignKey: 'employer_id', as: 'employer' });

// EmployerUser ↔ EmployerRole
EmployerRole.hasMany(EmployerUser, { foreignKey: 'role_id', as: 'members' });
EmployerUser.belongsTo(EmployerRole, { foreignKey: 'role_id', as: 'role' });

// EmployerRole ↔ Permission (M:M via RolePermission)
EmployerRole.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(EmployerRole, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });

// Employer ↔ Job
Employer.hasMany(Job, { foreignKey: 'employer_id', as: 'jobs' });
Job.belongsTo(Employer, { foreignKey: 'employer_id', as: 'employer' });

// Job ↔ Skill (M:M via JobSkill)
Job.belongsToMany(Skill, { through: JobSkill, foreignKey: 'job_id', as: 'skills' });
Skill.belongsToMany(Job, { through: JobSkill, foreignKey: 'skill_id', as: 'jobs' });

// Job → masters
Job.belongsTo(Department,     { foreignKey: 'department_id',      as: 'department' });
Job.belongsTo(JobRole,        { foreignKey: 'job_role_id',        as: 'jobRole' });
Job.belongsTo(EmploymentType, { foreignKey: 'employment_type_id', as: 'employmentType' });
Job.belongsTo(ExperienceLevel,{ foreignKey: 'experience_level_id',as: 'experienceLevel' });
Job.belongsTo(EducationLevel, { foreignKey: 'education_level_id', as: 'educationLevel' });
Job.belongsTo(WorkMode,       { foreignKey: 'work_mode_id',       as: 'workMode' });
Job.belongsTo(City,           { foreignKey: 'city_id',            as: 'city' });
Job.belongsTo(Currency,       { foreignKey: 'currency_id',        as: 'currency' });
Job.belongsTo(NoticePeriod,   { foreignKey: 'notice_period_id',   as: 'noticePeriod' });

// Job ↔ Application
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// User(seeker) ↔ Application
User.hasMany(Application, { foreignKey: 'seeker_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'seeker_id', as: 'seeker' });

// SeekerProfile ↔ Experience / Education / Skills
SeekerProfile.hasMany(SeekerExperience, { foreignKey: 'seeker_id', as: 'experiences' });
SeekerExperience.belongsTo(SeekerProfile, { foreignKey: 'seeker_id', as: 'profile' });

SeekerProfile.hasMany(SeekerEducation, { foreignKey: 'seeker_id', as: 'educations' });
SeekerEducation.belongsTo(SeekerProfile, { foreignKey: 'seeker_id', as: 'profile' });

SeekerProfile.belongsToMany(Skill, { through: SeekerSkill, foreignKey: 'seeker_id', as: 'skills' });
Skill.belongsToMany(SeekerProfile, { through: SeekerSkill, foreignKey: 'skill_id', as: 'seekers' });

// SeekerExperience → masters
SeekerExperience.belongsTo(EmploymentType, { foreignKey: 'employment_type_id', as: 'employmentType' });
SeekerExperience.belongsTo(City,           { foreignKey: 'city_id',            as: 'city' });

// SeekerEducation → masters
SeekerEducation.belongsTo(Qualification, { foreignKey: 'qualification_id', as: 'qualification' });

// SeekerProfile → masters
SeekerProfile.belongsTo(Currency,     { foreignKey: 'currency_id',      as: 'currency' });
SeekerProfile.belongsTo(NoticePeriod, { foreignKey: 'notice_period_id', as: 'noticePeriod' });
SeekerProfile.belongsTo(City,         { foreignKey: 'city_id',          as: 'city' });
SeekerProfile.belongsTo(WorkMode,     { foreignKey: 'work_mode_id',     as: 'workMode' });

// User ↔ SavedJob / SavedSearch / JobAlert
User.hasMany(SavedJob,    { foreignKey: 'user_id', as: 'savedJobs' });
SavedJob.belongsTo(User,  { foreignKey: 'user_id', as: 'user' });
Job.hasMany(SavedJob,     { foreignKey: 'job_id',  as: 'savedByUsers' });
SavedJob.belongsTo(Job,   { foreignKey: 'job_id',  as: 'job' });

User.hasMany(SavedSearch,   { foreignKey: 'user_id', as: 'savedSearches' });
SavedSearch.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(JobAlert,   { foreignKey: 'user_id', as: 'jobAlerts' });
JobAlert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Master: JobRole → Department
Department.hasMany(JobRole, { foreignKey: 'dept_id', as: 'job_roles' });
JobRole.belongsTo(Department, { foreignKey: 'dept_id', as: 'department' });

// Master: Qualification → EducationLevel
EducationLevel.hasMany(Qualification, { foreignKey: 'education_level_id', as: 'qualifications' });
Qualification.belongsTo(EducationLevel, { foreignKey: 'education_level_id', as: 'educationLevel' });

// Employer → masters
Employer.belongsTo(Industry,    { foreignKey: 'industry_id',    as: 'industry' });
Employer.belongsTo(CompanySize, { foreignKey: 'company_size_id', as: 'companySize' });

module.exports = {
  sequelize,
  // Core
  User, RefreshToken, Employer, EmployerUser, EmployerRole, Permission, RolePermission,
  // Masters
  Industry, Department, JobRole, Skill, EmploymentType, ExperienceLevel,
  EducationLevel, Qualification, Currency, City, WorkMode, NoticePeriod, CompanySize,
  // Jobs
  Job, JobSkill,
  // Seeker
  SeekerProfile, SeekerExperience, SeekerEducation, SeekerSkill, Application,
  // Search
  SavedJob, SavedSearch, JobAlert,
};
