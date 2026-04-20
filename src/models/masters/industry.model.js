const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Industry = sequelize.define('Industry', {
  id:                 { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  industry_name:      { type: DataTypes.STRING(100), allowNull: false },
  industry_code:      { type: DataTypes.STRING(20), unique: true },
  parent_industry_id: { type: DataTypes.INTEGER },        // null = top-level; supports hierarchy
  is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'industries', timestamps: false });

module.exports = Industry;
