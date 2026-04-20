const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id:             { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  job_id:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  seeker_id:      { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  status:         {
    type: DataTypes.ENUM('applied','screening','shortlisted','interview_scheduled','offer_extended','hired','rejected','withdrawn'),
    defaultValue: 'applied',
  },
  cover_letter:   { type: DataTypes.TEXT },
  resume_url:     { type: DataTypes.STRING(255) },
  employer_notes: { type: DataTypes.TEXT },
  applied_at:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'applications',
  underscored: true,
  indexes: [{ unique: true, fields: ['job_id', 'seeker_id'] }],
});

module.exports = Application;
