const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });

const generateRefreshToken = () => crypto.randomBytes(48).toString('hex'); // raw — store hash in DB

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = { generateAccessToken, generateRefreshToken, hashToken, generateOtp };
