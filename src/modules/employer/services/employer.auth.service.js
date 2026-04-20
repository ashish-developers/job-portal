const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { EmployerUser, EmployerRole, RolePermission, Permission } = require('../../../models');
const { generateAccessToken, generateRefreshToken, hashToken } = require('../../../utils/token');
const { sendPasswordResetEmail } = require('../../../utils/email');

const BCRYPT_ROUNDS = 12;

const buildToken = async (empUser) => {
  const role = await EmployerRole.findByPk(empUser.role_id, {
    include: [{
      model: RolePermission,
      as: 'rolePermissions',
      include: [{ model: Permission, as: 'permission', attributes: ['slug'] }],
    }],
  });

  const permissions = empUser.is_admin
    ? ['*']
    : (role?.rolePermissions?.map(rp => rp.permission.slug) ?? []);

  const payload = {
    id:          empUser.id,
    employer_id: empUser.employer_id,
    role_id:     empUser.role_id,
    is_admin:    empUser.is_admin,
    permissions,
  };

  return generateAccessToken(payload);
};

const login = async ({ email, password }) => {
  const user = await EmployerUser.findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (user.status !== 'active') throw Object.assign(new Error('Account is not active'), { status: 403 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const accessToken = await buildToken(user);
  return {
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, employer_id: user.employer_id, is_admin: user.is_admin },
  };
};

const forgotPassword = async ({ email }) => {
  const user = await EmployerUser.findOne({ where: { email } });
  if (!user) return;
  const raw = generateRefreshToken();
  const exp = new Date(Date.now() + 60 * 60 * 1000);
  await user.update({ reset_token: hashToken(raw), reset_token_expires: exp });
  const link = `${process.env.FRONTEND_URL}/employer/reset-password?token=${raw}&email=${email}`;
  await sendPasswordResetEmail({ to: email, name: user.name, resetLink: link });
};

const resetPassword = async ({ email, token, password }) => {
  const user = await EmployerUser.findOne({
    where: { email, reset_token: hashToken(token), reset_token_expires: { [Op.gt]: new Date() } },
  });
  if (!user) throw Object.assign(new Error('Token invalid or expired'), { status: 400 });
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await user.update({ password: hashed, reset_token: null, reset_token_expires: null });
};

const getMe = async (id) => {
  const user = await EmployerUser.findByPk(id, {
    attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
  });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

module.exports = { login, forgotPassword, resetPassword, getMe };
