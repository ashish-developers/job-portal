const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:   { type: DataTypes.STRING(100), allowNull: false },
  slug:   { type: DataTypes.STRING(100), allowNull: false, unique: true },
  module: { type: DataTypes.STRING(100), allowNull: false },
  action: { type: DataTypes.STRING(50), allowNull: false },
}, { tableName: 'permissions', timestamps: false });

module.exports = Permission;
