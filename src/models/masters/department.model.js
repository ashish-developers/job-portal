const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Department = sequelize.define('Department', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dept_name: { type: DataTypes.STRING(100), allowNull: false },
  dept_code: { type: DataTypes.STRING(20), unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'departments', timestamps: false });

module.exports = Department;
