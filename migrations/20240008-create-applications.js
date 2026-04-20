'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id:             { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      job_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: 'jobs', key: 'id' }, onDelete: 'CASCADE' },
      seeker_id:      { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      status:         {
        type: Sequelize.STRING(50),
        defaultValue: 'applied',
      },
      cover_letter:   { type: Sequelize.TEXT },
      resume_url:     { type: Sequelize.STRING(255) },
      employer_notes: { type: Sequelize.TEXT },
      applied_at:     { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('applications', ['job_id', 'seeker_id'], { unique: true });
    await queryInterface.addIndex('applications', ['seeker_id']);
    await queryInterface.addIndex('applications', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('applications');
  },
};
