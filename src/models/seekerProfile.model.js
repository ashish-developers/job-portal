const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeekerProfile = sequelize.define('SeekerProfile', {
  id:                     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:                { type: DataTypes.INTEGER, allowNull: false, unique: true },
  headline:               { type: DataTypes.STRING(200) },
  summary:                { type: DataTypes.TEXT },
  current_title:          { type: DataTypes.STRING(150) },
  total_experience_years: { type: DataTypes.DECIMAL(4, 1) },
  current_salary:         { type: DataTypes.DECIMAL(12, 2) },
  expected_salary:        { type: DataTypes.DECIMAL(12, 2) },
  currency_id:            { type: DataTypes.INTEGER },
  notice_period_id:       { type: DataTypes.INTEGER },
  city_id:                { type: DataTypes.INTEGER },
  work_mode_id:           { type: DataTypes.INTEGER },
  profile_photo_url:      { type: DataTypes.STRING(255) },
  resume_url:             { type: DataTypes.STRING(255) },
  linkedin_url:           { type: DataTypes.STRING(255) },
  github_url:             { type: DataTypes.STRING(255) },
  portfolio_url:          { type: DataTypes.STRING(255) },
  is_actively_looking:    { type: DataTypes.BOOLEAN, defaultValue: true },
  profile_completion:     { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'seeker_profiles',
  underscored: true,
});

module.exports = SeekerProfile;
