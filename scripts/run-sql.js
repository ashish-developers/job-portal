require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Use override credentials from CLI args: node scripts/run-sql.js <user> <password>
const user     = process.argv[2] || process.env.DB_ADMIN_USER || process.env.DB_USER;
const password = process.argv[3] || process.env.DB_ADMIN_PASSWORD || process.env.DB_PASSWORD;

const client = new Client({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user,
  password,
});

const sql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf8');

(async () => {
  console.log(`Connecting as: ${user}`);
  await client.connect();
  console.log('Connected to PostgreSQL.');
  try {
    await client.query(sql);
    console.log('✓ All tables created successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
})();
