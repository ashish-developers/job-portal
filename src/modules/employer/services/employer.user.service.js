const bcrypt = require('bcryptjs');
const { EmployerUser, EmployerRole } = require('../../../models');

const BCRYPT_ROUNDS = 12;

const listUsers = async (employerId) => {
  return EmployerUser.findAll({
    where: { employer_id: employerId },
    attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
    include: [{ model: EmployerRole, as: 'role', attributes: ['id', 'name'] }],
  });
};

const createUser = async (employerId, { name, email, password, role_id }) => {
  const role = await EmployerRole.findOne({ where: { id: role_id, employer_id: employerId } });
  if (!role) throw Object.assign(new Error('Role not found or does not belong to this employer'), { status: 404 });

  const exists = await EmployerUser.findOne({ where: { email } });
  if (exists) throw Object.assign(new Error('Email already in use'), { status: 409 });

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await EmployerUser.create({
    employer_id: employerId, role_id, name, email, password: hashed, is_admin: false, status: 'active',
  });

  const { password: _, reset_token: __, reset_token_expires: ___, ...safe } = user.toJSON();
  return safe;
};

const updateUser = async (employerId, userId, { name, role_id, status }) => {
  const user = await EmployerUser.findOne({ where: { id: userId, employer_id: employerId } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (user.is_admin) throw Object.assign(new Error('Cannot modify the employer admin user'), { status: 403 });

  if (role_id) {
    const role = await EmployerRole.findOne({ where: { id: role_id, employer_id: employerId } });
    if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  }

  await user.update({ name, role_id, status });
  return user.reload();
};

const deleteUser = async (employerId, userId) => {
  const user = await EmployerUser.findOne({ where: { id: userId, employer_id: employerId } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (user.is_admin) throw Object.assign(new Error('Cannot delete the employer admin user'), { status: 403 });
  await user.destroy();
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
