require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME     || 'job_portal',
    host:     process.env.DB_HOST     || '127.0.0.1',
    dialect:  'mysql',
    logging:  console.log,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    dialect:  'mysql',
    logging:  false,
  },
};
