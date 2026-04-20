const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const City = sequelize.define('City', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city_name: { type: DataTypes.STRING(150), allowNull: false },
  state:     { type: DataTypes.STRING(100) },
  country:   { type: DataTypes.STRING(100), defaultValue: 'India' },
  is_remote: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'cities', timestamps: false });
module.exports = City;
