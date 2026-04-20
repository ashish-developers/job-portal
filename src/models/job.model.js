const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id:                  { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  employer_id:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title:               { type: DataTypes.STRING(200), allowNull: false },
  slug:                { type: DataTypes.STRING(250), allowNull: false, unique: true },
  description:         { type: DataTypes.TEXT('long'), allowNull: false },
  requirements:        { type: DataTypes.TEXT },
  department_id:       { type: DataTypes.INTEGER.UNSIGNED },
  job_role_id:         { type: DataTypes.INTEGER.UNSIGNED },
  employment_type_id:  { type: DataTypes.INTEGER.UNSIGNED },
  experience_level_id: { type: DataTypes.INTEGER.UNSIGNED },
  min_experience:      { type: DataTypes.INTEGER },
  max_experience:      { type: DataTypes.INTEGER },
  education_level_id:  { type: DataTypes.INTEGER.UNSIGNED },
  work_mode_id:        { type: DataTypes.INTEGER.UNSIGNED },
  city_id:             { type: DataTypes.INTEGER.UNSIGNED },
  salary_min:          { type: DataTypes.DECIMAL(12, 2) },
  salary_max:          { type: DataTypes.DECIMAL(12, 2) },
  currency_id:         { type: DataTypes.INTEGER.UNSIGNED },
  salary_disclosed:    { type: DataTypes.BOOLEAN, defaultValue: true },
  notice_period_id:    { type: DataTypes.INTEGER.UNSIGNED },
  openings:            { type: DataTypes.INTEGER, defaultValue: 1 },
  status:              { type: DataTypes.ENUM('draft','published','paused','closed','expired'), defaultValue: 'draft' },
  expires_at:          { type: DataTypes.DATE },
  published_at:        { type: DataTypes.DATE },
  created_by:          { type: DataTypes.INTEGER.UNSIGNED },
  views_count:         { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  applications_count:  { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
}, {
  tableName: 'jobs',
  underscored: true,
});

module.exports = Job;
