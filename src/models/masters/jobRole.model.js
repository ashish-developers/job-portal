const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const JobRole = sequelize.define('JobRole', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role_title:       { type: DataTypes.STRING(150), allowNull: false },
  dept_id:          { type: DataTypes.INTEGER },
  experience_level: { type: DataTypes.STRING(50) },
  is_active:        { type: DataTypes.BOOLEAN, defaultValue: true },
  is_approved:      { type: DataTypes.BOOLEAN, defaultValue: true }, // false = employer-submitted, pending admin approval
}, { tableName: 'job_roles', timestamps: false });

module.exports = JobRole;
