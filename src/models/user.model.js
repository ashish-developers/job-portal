const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:                   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:                 { type: DataTypes.STRING(200), allowNull: false },
  email:                { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password:             { type: DataTypes.STRING(255), allowNull: false },
  mobile:               { type: DataTypes.STRING(15) },
  role:                 { type: DataTypes.STRING(50), allowNull: false },
  // employer sub-status: pending_profile = step-1 done, needs step-2
  status:               { type: DataTypes.STRING(50), defaultValue: 'pending_profile' },
  email_verified:       { type: DataTypes.BOOLEAN, defaultValue: false },
  email_verify_token:   { type: DataTypes.STRING(255) },
  email_verify_expires: { type: DataTypes.DATE },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;
