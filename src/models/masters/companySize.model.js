const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const CompanySize = sequelize.define('CompanySize', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(50), allowNull: false, unique: true },
  min_count: { type: DataTypes.INTEGER },
  max_count: { type: DataTypes.INTEGER },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'company_sizes', timestamps: false });
module.exports = CompanySize;
