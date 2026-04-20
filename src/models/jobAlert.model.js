const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobAlert = sequelize.define('JobAlert', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id:      { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name:         { type: DataTypes.STRING(150), allowNull: false },
  filters:      { type: DataTypes.JSON, allowNull: false },
  frequency:    { type: DataTypes.ENUM('instant','daily','weekly'), defaultValue: 'daily' },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
  last_sent_at: { type: DataTypes.DATE },
}, {
  tableName: 'job_alerts',
  underscored: true,
});

module.exports = JobAlert;
