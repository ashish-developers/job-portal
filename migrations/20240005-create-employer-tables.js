'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employers', {
      id:                  { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id:             { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, unique: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      company_name:        { type: Sequelize.STRING(200), allowNull: false },
      company_slug:        { type: Sequelize.STRING(220), allowNull: false, unique: true },
      company_email:       { type: Sequelize.STRING(150), allowNull: false, unique: true },
      company_phone:       { type: Sequelize.STRING(20) },
      industry_id:         { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'industries', key: 'industry_id' } },
      company_size_id:     { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'company_sizes', key: 'id' } },
      gst_number:          { type: Sequelize.STRING(20) },
      cin_number:          { type: Sequelize.STRING(25) },
      website_url:         { type: Sequelize.STRING(255) },
      logo_url:            { type: Sequelize.STRING(255) },
      description:         { type: Sequelize.TEXT },
      founded_year:        { type: Sequelize.INTEGER },
      headquarters_city:   { type: Sequelize.STRING(100) },
      company_address:     { type: Sequelize.TEXT },
      linkedin_url:        { type: Sequelize.STRING(255) },
      twitter_url:         { type: Sequelize.STRING(255) },
      glassdoor_url:       { type: Sequelize.STRING(255) },
      contact_name:        { type: Sequelize.STRING(100) },
      contact_designation: { type: Sequelize.STRING(100) },
      contact_phone:       { type: Sequelize.STRING(20) },
      verification_status: { type: Sequelize.ENUM('PENDING','UNDER_REVIEW','VERIFIED','REJECTED'), defaultValue: 'PENDING' },
      verification_note:   { type: Sequelize.TEXT },
      verified_by:         { type: Sequelize.INTEGER.UNSIGNED },
      verified_at:         { type: Sequelize.DATE },
      is_active:           { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('employer_roles', {
      id:          { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      employer_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'employers', key: 'id' }, onDelete: 'CASCADE' },
      name:        { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.STRING(255) },
      is_default:  { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('role_permissions', {
      id:            { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      role_id:       { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'employer_roles', key: 'id' }, onDelete: 'CASCADE' },
      permission_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('role_permissions', ['role_id', 'permission_id'], { unique: true });

    await queryInterface.createTable('employer_users', {
      id:                   { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      employer_id:          { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'employers', key: 'id' }, onDelete: 'CASCADE' },
      role_id:              { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'employer_roles', key: 'id' } },
      name:                 { type: Sequelize.STRING(100), allowNull: false },
      email:                { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password:             { type: Sequelize.STRING(255), allowNull: false },
      is_admin:             { type: Sequelize.BOOLEAN, defaultValue: false },
      status:               { type: Sequelize.ENUM('active','inactive','suspended'), defaultValue: 'active' },
      reset_token:          { type: Sequelize.STRING(64) },
      reset_token_expires:  { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('employer_users');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('employer_roles');
    await queryInterface.dropTable('employers');
  },
};
