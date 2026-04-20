const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employer = sequelize.define('Employer', {
  id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:             { type: DataTypes.INTEGER, allowNull: false, unique: true },
  company_name:        { type: DataTypes.STRING(255), allowNull: false },
  company_slug:        { type: DataTypes.STRING(255), unique: true },
  company_email:       { type: DataTypes.STRING(255), allowNull: false, unique: true },
  company_phone:       { type: DataTypes.STRING(50) },
  // FK references (stored as integers, resolved via masters)
  industry_id:         { type: DataTypes.INTEGER },
  company_size_id:     { type: DataTypes.INTEGER },
  gst_number:          { type: DataTypes.STRING(20) },
  cin_number:          { type: DataTypes.STRING(25) },
  website_url:         { type: DataTypes.STRING(500) },
  logo_url:            { type: DataTypes.STRING(500) },
  description:         { type: DataTypes.TEXT },
  founded_year:        { type: DataTypes.INTEGER },
  headquarters_city:   { type: DataTypes.STRING(100) },
  company_address:     { type: DataTypes.TEXT },
  // Social links
  linkedin_url:        { type: DataTypes.STRING(500) },
  twitter_url:         { type: DataTypes.STRING(500) },
  glassdoor_url:       { type: DataTypes.STRING(500) },
  // Primary contact
  contact_name:        { type: DataTypes.STRING(150) },
  contact_designation: { type: DataTypes.STRING(150) },
  contact_phone:       { type: DataTypes.STRING(20) },
  // Verification workflow: PENDING → UNDER_REVIEW → VERIFIED / REJECTED
  verification_status: { type: DataTypes.STRING(50), defaultValue: 'PENDING' },
  verification_note:   { type: DataTypes.TEXT },          // admin rejection reason
  verified_by:         { type: DataTypes.INTEGER },       // admin user_id
  verified_at:         { type: DataTypes.DATE },
  is_active:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'employers',
  timestamps: true,
});

module.exports = Employer;
