const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const NoticePeriod = sequelize.define('NoticePeriod', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(50), allowNull: false, unique: true },
  days:      { type: DataTypes.INTEGER },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'notice_periods', timestamps: false });
module.exports = NoticePeriod;
