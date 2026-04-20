const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Qualification = sequelize.define('Qualification', {
  id:                { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:             { type: DataTypes.STRING(100), allowNull: false, unique: true },
  education_level_id:{ type: DataTypes.INTEGER },
  is_active:         { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'qualifications', timestamps: false });
module.exports = Qualification;
