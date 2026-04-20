'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seeker_profiles', {
      id:                     { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id:                { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      headline:               { type: Sequelize.STRING(200) },
      summary:                { type: Sequelize.TEXT },
      current_title:          { type: Sequelize.STRING(150) },
      total_experience_years: { type: Sequelize.DECIMAL(4, 1) },
      current_salary:         { type: Sequelize.DECIMAL(12, 2) },
      expected_salary:        { type: Sequelize.DECIMAL(12, 2) },
      currency_id:            { type: Sequelize.INTEGER, references: { model: 'currencies', key: 'id' } },
      notice_period_id:       { type: Sequelize.INTEGER, references: { model: 'notice_periods', key: 'id' } },
      city_id:                { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' } },
      work_mode_id:           { type: Sequelize.INTEGER, references: { model: 'work_modes', key: 'id' } },
      profile_photo_url:      { type: Sequelize.STRING(255) },
      resume_url:             { type: Sequelize.STRING(255) },
      linkedin_url:           { type: Sequelize.STRING(255) },
      github_url:             { type: Sequelize.STRING(255) },
      portfolio_url:          { type: Sequelize.STRING(255) },
      is_actively_looking:    { type: Sequelize.BOOLEAN, defaultValue: true },
      profile_completion:     { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('seeker_experiences', {
      id:                 { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      seeker_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: 'seeker_profiles', key: 'id' }, onDelete: 'CASCADE' },
      company_name:       { type: Sequelize.STRING(200), allowNull: false },
      job_title:          { type: Sequelize.STRING(150), allowNull: false },
      employment_type_id: { type: Sequelize.INTEGER, references: { model: 'employment_types', key: 'id' } },
      city_id:            { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' } },
      start_date:         { type: Sequelize.DATEONLY, allowNull: false },
      end_date:           { type: Sequelize.DATEONLY },
      is_current:         { type: Sequelize.BOOLEAN, defaultValue: false },
      description:        { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('seeker_educations', {
      id:               { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      seeker_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: 'seeker_profiles', key: 'id' }, onDelete: 'CASCADE' },
      institution_name: { type: Sequelize.STRING(200), allowNull: false },
      qualification_id: { type: Sequelize.INTEGER, references: { model: 'qualifications', key: 'id' } },
      field_of_study:   { type: Sequelize.STRING(150) },
      start_year:       { type: Sequelize.INTEGER },
      end_year:         { type: Sequelize.INTEGER },
      is_current:       { type: Sequelize.BOOLEAN, defaultValue: false },
      grade:            { type: Sequelize.STRING(50) },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('seeker_skills', {
      id:          { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      seeker_id:   { type: Sequelize.INTEGER, allowNull: false, references: { model: 'seeker_profiles', key: 'id' }, onDelete: 'CASCADE' },
      skill_id:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'skills', key: 'id' }, onDelete: 'CASCADE' },
      proficiency: { type: Sequelize.ENUM('beginner','intermediate','advanced','expert'), defaultValue: 'intermediate' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('seeker_skills', ['seeker_id', 'skill_id'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seeker_skills');
    await queryInterface.dropTable('seeker_educations');
    await queryInterface.dropTable('seeker_experiences');
    await queryInterface.dropTable('seeker_profiles');
  },
};
