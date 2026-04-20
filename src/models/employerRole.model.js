const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployerRole = sequelize.define('EmployerRole', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employer_id: { type: DataTypes.INTEGER, allowNull: false },
  name:        { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.STRING(255) },
  is_default:  { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'employer_roles', timestamps: true });

module.exports = EmployerRole;
