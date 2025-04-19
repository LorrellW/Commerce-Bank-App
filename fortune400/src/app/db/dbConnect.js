// dbConnect.js
import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fortune400',
  password: process.env.DB_PASSWORD,  // Make sure this is set in .env.local
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  }
});

module.exports = pool;
