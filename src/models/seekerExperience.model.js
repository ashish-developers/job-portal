const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeekerExperience = sequelize.define('SeekerExperience', {
  id:                 { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  seeker_id:          { type: DataTypes.INTEGER, allowNull: false },
  company_name:       { type: DataTypes.STRING(200), allowNull: false },
  job_title:          { type: DataTypes.STRING(150), allowNull: false },
  employment_type_id: { type: DataTypes.INTEGER },
  city_id:            { type: DataTypes.INTEGER },
  start_date:         { type: DataTypes.DATEONLY, allowNull: false },
  end_date:           { type: DataTypes.DATEONLY },
  is_current:         { type: DataTypes.BOOLEAN, defaultValue: false },
  description:        { type: DataTypes.TEXT },
}, {
  tableName: 'seeker_experiences',
  underscored: true,
});

module.exports = SeekerExperience;
