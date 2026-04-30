// lugas_hermanto_zVUj
const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Terapkan middleware auth untuk SEMUA rute di dalam file ini
router.use(authenticateToken);

// 1. Get Logged-in User Profile
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, fullname, fullname AS name FROM users WHERE id = $1', 
      [req.user.id]
    );
    
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'User tidak ditemukan' });
    
    // PERBAIKAN: Tambahkan properti role secara manual
    const user = rows[0];
    user.role = 'user';

    res.status(200).json({ status: 'success', data: user });
  } catch (err) { next(err); }
});

// 2. Get My Applications
router.get('/applications', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        a.*, 
        u.fullname AS user_name, 
        u.email, 
        j.title AS job_title, 
        j.description AS job_description, 
        j.company_id, 
        c.name AS company_name, 
        c.location AS company_location 
      FROM applications a 
      JOIN users u ON a.user_id = u.id 
      JOIN jobs j ON a.job_id = j.id 
      JOIN companies c ON j.company_id = c.id 
      WHERE a.user_id = $1`, [req.user.id]);

    res.status(200).json({ status: 'success', data: { applications: rows } });
  } catch (err) { next(err); }
});

// 3. Get My Bookmarks
router.get('/bookmarks', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        b.id,
        b.user_id,
        b.job_id,
        b.created_at,
        j.title,
        j.description,
        j.company_id,
        j.category_id,
        j.salary,
        j.type,
        j.status,
        j.created_at AS job_created_at,
        j.updated_at AS job_updated_at,
        c.name AS company_name,
        c.location AS company_location,
        c.description AS company_description,
        cat.name AS category_name,
        cat.description AS category_description
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      JOIN categories cat ON j.category_id = cat.id
      WHERE b.user_id = $1`,
      [req.user.id]
    );
    res.status(200).json({ status: 'success', data: { bookmarks: rows } });
  } catch (err) { next(err); }
});

module.exports = router;