const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployerUser = sequelize.define('EmployerUser', {
  id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employer_id:         { type: DataTypes.INTEGER, allowNull: false },
  role_id:             { type: DataTypes.INTEGER },
  name:                { type: DataTypes.STRING(150), allowNull: false },
  email:               { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password:            { type: DataTypes.STRING(255), allowNull: false },
  is_admin:            { type: DataTypes.BOOLEAN, defaultValue: false },
  status:              { type: DataTypes.STRING(50), defaultValue: 'active' },
  reset_token:         { type: DataTypes.STRING(255) },
  reset_token_expires: { type: DataTypes.DATE },
}, { tableName: 'employer_users', timestamps: true, underscored: true });

module.exports = EmployerUser;
