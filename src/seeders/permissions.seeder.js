'use strict';

const PERMISSIONS = [
  { name: 'View Jobs',          slug: 'jobs:view',           module: 'jobs',         action: 'view' },
  { name: 'Create Job',         slug: 'jobs:create',         module: 'jobs',         action: 'create' },
  { name: 'Edit Job',           slug: 'jobs:edit',           module: 'jobs',         action: 'edit' },
  { name: 'Delete Job',         slug: 'jobs:delete',         module: 'jobs',         action: 'delete' },
  { name: 'View Applications',  slug: 'applications:view',   module: 'applications', action: 'view' },
  { name: 'Update Application', slug: 'applications:edit',   module: 'applications', action: 'edit' },
  { name: 'Delete Application', slug: 'applications:delete', module: 'applications', action: 'delete' },
  { name: 'View Users',         slug: 'users:view',          module: 'users',        action: 'view' },
  { name: 'Create User',        slug: 'users:create',        module: 'users',        action: 'create' },
  { name: 'Edit User',          slug: 'users:edit',          module: 'users',        action: 'edit' },
  { name: 'Delete User',        slug: 'users:delete',        module: 'users',        action: 'delete' },
  { name: 'View Roles',         slug: 'roles:view',          module: 'roles',        action: 'view' },
  { name: 'Create Role',        slug: 'roles:create',        module: 'roles',        action: 'create' },
  { name: 'Edit Role',          slug: 'roles:edit',          module: 'roles',        action: 'edit' },
  { name: 'Delete Role',        slug: 'roles:delete',        module: 'roles',        action: 'delete' },
  { name: 'View Analytics',     slug: 'analytics:view',      module: 'analytics',    action: 'view' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', PERMISSIONS, { ignoreDuplicates: true });
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
