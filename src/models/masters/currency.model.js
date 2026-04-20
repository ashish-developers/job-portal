const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Currency = sequelize.define('Currency', {
  id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code:   { type: DataTypes.STRING(10), allowNull: false, unique: true },
  name:   { type: DataTypes.STRING(100), allowNull: false },
  symbol: { type: DataTypes.STRING(10) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'currencies', timestamps: false });
module.exports = Currency;
