'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('industries', {
      industry_id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      industry_name:      { type: Sequelize.STRING(100), allowNull: false },
      industry_code:      { type: Sequelize.STRING(20), unique: true },
      parent_industry_id: { type: Sequelize.INTEGER, references: { model: 'industries', key: 'industry_id' } },
      is_active:          { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:         { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at:         { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('departments', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      dept_name: { type: Sequelize.STRING(100), allowNull: false },
      dept_code: { type: Sequelize.STRING(20), unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('experience_levels', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:     { type: Sequelize.STRING(50), allowNull: false },
      min_years: { type: Sequelize.INTEGER },
      max_years: { type: Sequelize.INTEGER },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('job_roles', {
      id:               { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      role_title:       { type: Sequelize.STRING(100), allowNull: false },
      dept_id:          { type: Sequelize.INTEGER, references: { model: 'departments', key: 'id' } },
      experience_level: { type: Sequelize.STRING(50) },
      is_active:        { type: Sequelize.BOOLEAN, defaultValue: true },
      is_approved:      { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('skills', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      skill_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      skill_type: { type: Sequelize.STRING(50) },
      category:   { type: Sequelize.STRING(100) },
      is_active:  { type: Sequelize.BOOLEAN, defaultValue: true },
      usage_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('employment_types', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:     { type: Sequelize.STRING(50), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('education_levels', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:      { type: Sequelize.STRING(100), allowNull: false },
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      is_active:  { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('qualifications', {
      id:                 { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:              { type: Sequelize.STRING(100), allowNull: false },
      education_level_id: { type: Sequelize.INTEGER, references: { model: 'education_levels', key: 'id' } },
      is_active:          { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('currencies', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code:      { type: Sequelize.STRING(10), allowNull: false, unique: true },
      name:      { type: Sequelize.STRING(50), allowNull: false },
      symbol:    { type: Sequelize.STRING(10) },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('cities', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      city_name: { type: Sequelize.STRING(100), allowNull: false },
      state:     { type: Sequelize.STRING(100) },
      country:   { type: Sequelize.STRING(100), defaultValue: 'India' },
      is_remote: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('work_modes', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:     { type: Sequelize.STRING(50), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('notice_periods', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:     { type: Sequelize.STRING(50), allowNull: false },
      days:      { type: Sequelize.INTEGER },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('company_sizes', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label:     { type: Sequelize.STRING(50), allowNull: false },
      min_count: { type: Sequelize.INTEGER },
      max_count: { type: Sequelize.INTEGER },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    const tables = [
      'company_sizes','notice_periods','work_modes','cities','currencies',
      'qualifications','education_levels','employment_types','skills',
      'job_roles','experience_levels','departments','industries',
    ];
    for (const t of tables) await queryInterface.dropTable(t);
  },
};
