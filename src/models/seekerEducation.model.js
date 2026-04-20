const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeekerEducation = sequelize.define('SeekerEducation', {
  id:               { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  seeker_id:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  institution_name: { type: DataTypes.STRING(200), allowNull: false },
  qualification_id: { type: DataTypes.INTEGER.UNSIGNED },
  field_of_study:   { type: DataTypes.STRING(150) },
  start_year:       { type: DataTypes.INTEGER },
  end_year:         { type: DataTypes.INTEGER },
  is_current:       { type: DataTypes.BOOLEAN, defaultValue: false },
  grade:            { type: DataTypes.STRING(50) },
}, {
  tableName: 'seeker_educations',
  underscored: true,
});

module.exports = SeekerEducation;
