const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Skill = sequelize.define('Skill', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  skill_name:  { type: DataTypes.STRING(100), allowNull: false, unique: true },
  skill_type:  { type: DataTypes.ENUM('TECHNICAL', 'SOFT', 'DOMAIN'), allowNull: false },
  category:    { type: DataTypes.STRING(100) },
  is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
  usage_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'skills', timestamps: false });

module.exports = Skill;
