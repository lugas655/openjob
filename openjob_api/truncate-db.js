const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

async function truncateDB() {
  try {
    console.log('Menghapus data di seluruh tabel...');
    await pool.query('TRUNCATE users, companies, categories, jobs, applications, bookmarks, documents, authentications CASCADE;');
    console.log('✅ Semua data berhasil dihapus dan siap untuk pengetesan ulang!');
  } catch (error) {
    console.error('❌ Gagal menghapus data:', error);
  } finally {
    await pool.end();
  }
}

truncateDB();
