const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const EmploymentType = sequelize.define('EmploymentType', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'employment_types', timestamps: false });
module.exports = EmploymentType;
