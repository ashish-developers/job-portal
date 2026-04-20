'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id:     { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name:   { type: Sequelize.STRING(100), allowNull: false },
      slug:   { type: Sequelize.STRING(100), allowNull: false, unique: true },
      module: { type: Sequelize.STRING(50), allowNull: false },
      action: { type: Sequelize.STRING(50), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('permissions');
  },
};
