const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const ExperienceLevel = sequelize.define('ExperienceLevel', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(50), allowNull: false, unique: true },
  min_years: { type: DataTypes.DECIMAL(4, 1) },
  max_years: { type: DataTypes.DECIMAL(4, 1) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'experience_levels', timestamps: false });
module.exports = ExperienceLevel;
