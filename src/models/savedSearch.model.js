const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedSearch = sequelize.define('SavedSearch', {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name:    { type: DataTypes.STRING(150), allowNull: false },
  filters: { type: DataTypes.JSON, allowNull: false },
}, {
  tableName: 'saved_searches',
  underscored: true,
});

module.exports = SavedSearch;
