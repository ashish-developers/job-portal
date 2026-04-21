const bcrypt = require('bcryptjs');
const sequelize = require('../../../config/database');
const { User, Employer, EmployerRole, EmployerUser } = require('../../../models');
const { uniqueSlug } = require('../../../utils/slug');
const { sendEmployerVerificationStatus } = require('../../../utils/email');

const BCRYPT_ROUNDS = 12;

// Step 2: employer completes company profile after email verification
const createProfile = async (userId, body) => {
  const user = await User.findByPk(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (user.role !== 'employer') throw Object.assign(new Error('Not an employer account'), { status: 403 });

  const existing = await Employer.findOne({ where: { user_id: userId } });
  if (existing) throw Object.assign(new Error('Company profile already exists'), { status: 409 });

  const {
    company_name, company_email, company_phone,
    industry_id, company_size_id, gst_number, cin_number,
    website_url, description, founded_year, headquarters_city,
    company_address, contact_name, contact_designation, contact_phone,
    linkedin_url, twitter_url, glassdoor_url,
  } = body;

  const t = await sequelize.transaction();
  try {
    const slug = await uniqueSlug(company_name);

    const employer = await Employer.create({
      user_id: userId, company_name, company_slug: slug,
      company_email, company_phone, industry_id, company_size_id,
      gst_number, cin_number, website_url, description, founded_year,
      headquarters_city, company_address, contact_name, contact_designation,
      contact_phone, linkedin_url, twitter_url, glassdoor_url,
      verification_status: 'PENDING',
    }, { transaction: t });

    // Create default Admin role for this employer
    const adminRole = await EmployerRole.create({
      employer_id: employer.id, name: 'Admin', description: 'Full access', is_default: true,
    }, { transaction: t });

    // Create employer admin sub-user linked to main user
    const hashed = await bcrypt.hash(body.admin_password || user.email, BCRYPT_ROUNDS);
    await EmployerUser.create({
      employer_id: employer.id,
      role_id:     adminRole.id,
      name:        user.name,
      email:       user.email,
      password:    hashed,
      is_admin:    true,
      status:      'active',
    }, { transaction: t });

    await user.update({ status: 'active' }, { transaction: t });

    await t.commit();
    return employer;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getProfile = async (employerId) => {
  const employer = await Employer.findByPk(employerId, {
    include: [{ association: 'user', attributes: ['name', 'email', 'mobile'] }],
    logging: console.log,
  });
  if (!employer) throw Object.assign(new Error('Employer not found'), { status: 404 });
  return employer;
};

const updateProfile = async (employerId, body) => {
  const employer = await Employer.findByPk(employerId);
  if (!employer) throw Object.assign(new Error('Employer not found'), { status: 404 });

  const allowed = [
    'company_phone', 'industry_id', 'company_size_id', 'gst_number', 'cin_number',
    'website_url', 'logo_url', 'description', 'founded_year', 'headquarters_city',
    'company_address', 'contact_name', 'contact_designation', 'contact_phone',
    'linkedin_url', 'twitter_url', 'glassdoor_url',
  ];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  // Changing company name triggers re-slug and drops back to PENDING
  if (body.company_name && body.company_name !== employer.company_name) {
    updates.company_name = body.company_name;
    updates.company_slug = await uniqueSlug(body.company_name);
    updates.verification_status = 'PENDING';
    updates.verification_note = null;
  }

  await employer.update(updates);
  return employer.reload();
};

// Admin-only: change verification status
const updateVerificationStatus = async (employerId, { status, note, adminId }) => {
  const employer = await Employer.findByPk(employerId, {
    include: [{ association: 'user', attributes: ['name', 'email'] }],
  });
  if (!employer) throw Object.assign(new Error('Employer not found'), { status: 404 });

  const allowed = ['UNDER_REVIEW', 'VERIFIED', 'REJECTED'];
  if (!allowed.includes(status))
    throw Object.assign(new Error('Invalid verification status'), { status: 400 });

  await employer.update({
    verification_status: status,
    verification_note:   note || null,
    verified_by:         status === 'VERIFIED' ? adminId : null,
    verified_at:         status === 'VERIFIED' ? new Date() : null,
  });

  await sendEmployerVerificationStatus({
    to:     employer.user.email,
    name:   employer.user.name,
    status,
    note,
  });

  return employer.reload();
};

module.exports = { createProfile, getProfile, updateProfile, updateVerificationStatus };
