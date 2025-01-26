const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');
const db = mysql.createPool({
  host: DB_HOST, // Gunakan nama service Docker, misalnya 'mysql2'
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

module.exports = db;