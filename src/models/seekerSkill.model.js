const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeekerSkill = sequelize.define('SeekerSkill', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  seeker_id:   { type: DataTypes.INTEGER, allowNull: false },
  skill_id:    { type: DataTypes.INTEGER, allowNull: false },
  proficiency: { type: DataTypes.ENUM('beginner','intermediate','advanced','expert'), defaultValue: 'intermediate' },
}, {
  tableName: 'seeker_skills',
  underscored: true,
  indexes: [{ unique: true, fields: ['seeker_id', 'skill_id'] }],
});

module.exports = SeekerSkill;
