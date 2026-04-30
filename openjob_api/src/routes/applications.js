// lugas_hermanto_zVUj
const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const { ApplicationSchema } = require('../utils/validator');
const { getCache, setCache, deleteCache } = require('../utils/cache');
const { publishMessage } = require('../config/rabbitmq');
const router = express.Router();

// Semua rute lamaran harus login dulu
router.use(authenticateToken);

const formatApplications = (rows) => {
  return rows.map(app => ({
    id: app.id,
    user_id: app.user_id,
    job_id: app.job_id,
    status: app.status,
    created_at: app.created_at,
    updated_at: app.updated_at,
    user_name: app.user_name,
    email: app.email,
    job_title: app.job_title,
    job_description: app.job_description,
    company_id: app.company_id,
    company_name: app.company_name,
    company_location: app.company_location
  }));
};

router.post('/', async (req, res, next) => {
  try {
    // Validasi input
    const { error, value } = ApplicationSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const user_id = req.user.id;
    const job_id = value.job_id || value.jobId;

    // 1. Cek duplicate terlebih dahulu
    const existing = await pool.query(
      'SELECT 1 FROM applications WHERE user_id = $1 AND job_id = $2 LIMIT 1',
      [user_id, job_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        status: 'failed',
        message: 'duplicate application'
      });
    }

    // 2. Cek apakah job ada
    const jobCheck = await pool.query('SELECT 1 FROM jobs WHERE id = $1', [job_id]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'job not found'
      });
    }

    // 3. Insert data ke tabel applications
    const applicationId = `app-${nanoid(16)}`;
    await pool.query(
      `INSERT INTO applications(id, user_id, job_id, status)
       VALUES($1, $2, $3, $4)`,
      [applicationId, user_id, job_id, 'pending']
    );

    // Hapus cache (agar data GET sinkron)
    await deleteCache(`applications:user:${user_id}`);
    await deleteCache(`applications:job:${job_id}`);

    // 4. Kirim message ke RabbitMQ
    publishMessage('export:applications', { application_id: applicationId });

    // 5. Response sukses
    return res.status(201).json({
      status: 'success',
      data: {
        id: applicationId,
        user_id: user_id,
        job_id: job_id,
        status: 'pending'
      }
    });
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
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
      JOIN companies c ON j.company_id = c.id`);
    res.status(200).json({ status: 'success', data: { applications: formatApplications(rows) } });
  } catch (err) { next(err); }
});

// --- RUTE YANG HILANG (BARU DITAMBAHKAN) ---
// 1. Get Applications by User ID
router.get('/user/:userId', async (req, res, next) => {
  try {
    const cacheKey = `applications:user:${req.params.userId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { applications: cachedData } });

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
      WHERE a.user_id = $1`, [req.params.userId]);
    await setCache(cacheKey, formatApplications(rows), 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { applications: formatApplications(rows) } });
  } catch (err) { next(err); }
});

// 2. Get Applications by Job ID
router.get('/job/:jobId', async (req, res, next) => {
  try {
    const cacheKey = `applications:job:${req.params.jobId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { applications: cachedData } });

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
      WHERE a.job_id = $1`, [req.params.jobId]);
    await setCache(cacheKey, formatApplications(rows), 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { applications: formatApplications(rows) } });
  } catch (err) { next(err); }
});
// ------------------------------------------

router.get('/:id', async (req, res, next) => {
  try {
    const cacheKey = `application:${req.params.id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: cachedData });

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
      WHERE a.id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Lamaran tidak ditemukan' });

    const result = formatApplications(rows)[0];
    await setCache(cacheKey, result, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: result });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ status: 'failed', message: 'Status wajib diisi' });

    const result = await pool.query('UPDATE applications SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Lamaran tidak ditemukan' });

    const app = result.rows[0];
    await deleteCache(`application:${app.id}`);
    await deleteCache(`applications:user:${app.user_id}`);
    await deleteCache(`applications:job:${app.job_id}`);

    res.status(200).json({ status: 'success', message: 'Status lamaran berhasil diperbarui' });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    // 1. Menggunakan RETURNING * untuk mengambil data sebelum dihapus (Poin 2 & 6)
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [req.params.id]);

    // 2. Jika rowCount 0, kembalikan 404 (Poin 1 & 5)
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Lamaran tidak ditemukan' });

    // 3. Ambil data lama untuk menghapus cache terkait (Poin 3)
    const app = result.rows[0];
    await deleteCache(`application:${app.id}`);
    await deleteCache(`applications:user:${app.user_id}`);
    await deleteCache(`applications:job:${app.job_id}`);

    // 4. Response sukses 200 (Poin 1 & 4)
    res.status(200).json({ status: 'success', message: 'Lamaran berhasil dihapus' });
  } catch (err) { next(err); }
});


module.exports = router;