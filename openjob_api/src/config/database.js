const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(); // Otomatis membaca PGUSER, PGPASSWORD, dll dari .env

module.exports = pool;