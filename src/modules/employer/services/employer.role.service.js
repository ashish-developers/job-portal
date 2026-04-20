const { EmployerRole, RolePermission, Permission } = require('../../../models');

const listRoles = async (employerId) => {
  return EmployerRole.findAll({
    where: { employer_id: employerId },
    include: [{
      model: RolePermission,
      as: 'rolePermissions',
      include: [{ model: Permission, as: 'permission' }],
    }],
  });
};

const createRole = async (employerId, { name, description, permission_ids = [] }) => {
  const role = await EmployerRole.create({ employer_id: employerId, name, description });
  if (permission_ids.length) {
    const rows = permission_ids.map(pid => ({ role_id: role.id, permission_id: pid }));
    await RolePermission.bulkCreate(rows, { ignoreDuplicates: true });
  }
  return role;
};

const updateRole = async (employerId, roleId, { name, description }) => {
  const role = await EmployerRole.findOne({ where: { id: roleId, employer_id: employerId } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  if (role.is_default) throw Object.assign(new Error('Default Admin role cannot be modified'), { status: 403 });
  await role.update({ name, description });
  return role;
};

const deleteRole = async (employerId, roleId) => {
  const role = await EmployerRole.findOne({ where: { id: roleId, employer_id: employerId } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  if (role.is_default) throw Object.assign(new Error('Default Admin role cannot be deleted'), { status: 403 });
  await role.destroy();
};

const addPermissions = async (employerId, roleId, permission_ids) => {
  const role = await EmployerRole.findOne({ where: { id: roleId, employer_id: employerId } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  const rows = permission_ids.map(pid => ({ role_id: roleId, permission_id: pid }));
  await RolePermission.bulkCreate(rows, { ignoreDuplicates: true });
};

const removePermissions = async (employerId, roleId, permission_ids) => {
  const role = await EmployerRole.findOne({ where: { id: roleId, employer_id: employerId } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  await RolePermission.destroy({ where: { role_id: roleId, permission_id: permission_ids } });
};

module.exports = { listRoles, createRole, updateRole, deleteRole, addPermissions, removePermissions };
