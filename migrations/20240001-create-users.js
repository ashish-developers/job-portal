'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:                   { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name:                 { type: Sequelize.STRING(100), allowNull: false },
      email:                { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password:             { type: Sequelize.STRING(255), allowNull: false },
      mobile:               { type: Sequelize.STRING(20) },
      role:                 { type: Sequelize.STRING(50), defaultValue: 'employer' },
      status:               { type: Sequelize.STRING(50), defaultValue: 'pending_profile' },
      email_verified:       { type: Sequelize.BOOLEAN, defaultValue: false },
      email_verify_token:   { type: Sequelize.STRING(255) },
      email_verify_expires: { type: Sequelize.DATE },
      created_at:           { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at:           { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
