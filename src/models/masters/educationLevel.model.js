const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const EducationLevel = sequelize.define('EducationLevel', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(100), allowNull: false, unique: true },
  sort_order:{ type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'education_levels', timestamps: false });
module.exports = EducationLevel;
