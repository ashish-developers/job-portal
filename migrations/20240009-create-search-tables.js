'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('saved_jobs', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users',  key: 'id' }, onDelete: 'CASCADE' },
      job_id:     { type: Sequelize.INTEGER, allowNull: false, references: { model: 'jobs',   key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('saved_jobs', ['user_id', 'job_id'], { unique: true });

    await queryInterface.createTable('saved_searches', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      name:       { type: Sequelize.STRING(150), allowNull: false },
      filters:    { type: Sequelize.JSON, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('saved_searches', ['user_id']);

    await queryInterface.createTable('job_alerts', {
      id:           { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id:      { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      name:         { type: Sequelize.STRING(150), allowNull: false },
      filters:      { type: Sequelize.JSON, allowNull: false },
      frequency:    { type: Sequelize.STRING(50), defaultValue: 'daily' },
      is_active:    { type: Sequelize.BOOLEAN, defaultValue: true },
      last_sent_at: { type: Sequelize.DATE },
      created_at:   { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at:   { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('job_alerts', ['user_id', 'is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_alerts');
    await queryInterface.dropTable('saved_searches');
    await queryInterface.dropTable('saved_jobs');
  },
};
