'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id:                  { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      employer_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: 'employers', key: 'id' }, onDelete: 'CASCADE' },
      title:               { type: Sequelize.STRING(200), allowNull: false },
      slug:                { type: Sequelize.STRING(250), allowNull: false, unique: true },
      description:         { type: Sequelize.TEXT, allowNull: false },
      requirements:        { type: Sequelize.TEXT },
      department_id:       { type: Sequelize.INTEGER, references: { model: 'departments', key: 'id' } },
      job_role_id:         { type: Sequelize.INTEGER, references: { model: 'job_roles', key: 'id' } },
      employment_type_id:  { type: Sequelize.INTEGER, references: { model: 'employment_types', key: 'id' } },
      experience_level_id: { type: Sequelize.INTEGER, references: { model: 'experience_levels', key: 'id' } },
      min_experience:      { type: Sequelize.INTEGER },
      max_experience:      { type: Sequelize.INTEGER },
      education_level_id:  { type: Sequelize.INTEGER, references: { model: 'education_levels', key: 'id' } },
      work_mode_id:        { type: Sequelize.INTEGER, references: { model: 'work_modes', key: 'id' } },
      city_id:             { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' } },
      salary_min:          { type: Sequelize.DECIMAL(12, 2) },
      salary_max:          { type: Sequelize.DECIMAL(12, 2) },
      currency_id:         { type: Sequelize.INTEGER, references: { model: 'currencies', key: 'id' } },
      salary_disclosed:    { type: Sequelize.BOOLEAN, defaultValue: true },
      notice_period_id:    { type: Sequelize.INTEGER, references: { model: 'notice_periods', key: 'id' } },
      openings:            { type: Sequelize.INTEGER, defaultValue: 1 },
      status:              { type: Sequelize.ENUM('draft','published','paused','closed','expired'), defaultValue: 'draft' },
      expires_at:          { type: Sequelize.DATE },
      published_at:        { type: Sequelize.DATE },
      created_by:          { type: Sequelize.INTEGER, references: { model: 'employer_users', key: 'id' } },
      views_count:         { type: Sequelize.INTEGER, defaultValue: 0 },
      applications_count:  { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('jobs', ['employer_id']);
    await queryInterface.addIndex('jobs', ['status']);
    await queryInterface.addIndex('jobs', ['city_id']);
    await queryInterface.addIndex('jobs', ['employment_type_id']);

    await queryInterface.createTable('job_skills', {
      id:       { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      job_id:   { type: Sequelize.INTEGER, allowNull: false, references: { model: 'jobs', key: 'id' }, onDelete: 'CASCADE' },
      skill_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'skills', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('job_skills', ['job_id', 'skill_id'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_skills');
    await queryInterface.dropTable('jobs');
  },
};
