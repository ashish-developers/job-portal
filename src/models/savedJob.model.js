const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  job_id:  { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'saved_jobs',
  underscored: true,
  indexes: [{ unique: true, fields: ['user_id', 'job_id'] }],
});

module.exports = SavedJob;
