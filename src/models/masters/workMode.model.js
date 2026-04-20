const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const WorkMode = sequelize.define('WorkMode', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(50), allowNull: false, unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'work_modes', timestamps: false });
module.exports = WorkMode;
