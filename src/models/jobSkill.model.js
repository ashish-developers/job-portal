const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobSkill = sequelize.define('JobSkill', {
  id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  job_id:   { type: DataTypes.INTEGER, allowNull: false },
  skill_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'job_skills',
  underscored: true,
  indexes: [{ unique: true, fields: ['job_id', 'skill_id'] }],
});

module.exports = JobSkill;
