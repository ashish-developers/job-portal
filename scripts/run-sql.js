require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const sql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf8');

(async () => {
  await client.connect();
  console.log('Connected to PostgreSQL.');
  try {
    await client.query(sql);
    console.log('All tables created successfully.');
  } catch (err) {
    console.error('Error:', err.message);
    console.error('SQL:', err.sql?.slice(0, 200));
  } finally {
    await client.end();
  }
})();
