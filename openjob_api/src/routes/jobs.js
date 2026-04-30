// lugas_hermanto_zVUj
const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const { JobSchema } = require('../utils/validator');
const { deleteCache } = require('../utils/cache');
const router = express.Router();

// Fungsi format lengkap (wajib ada camelCase dan snake_case agar Postman tidak bingung)
const formatJobs = (rows) => {
  return rows.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description,
    company_id: job.company_id,
    category_id: job.category_id,
    company_name: job.company_name,
    company_location: job.company_location,
    category_name: job.category_name,
    salary: job.salary,
    type: job.type,
    status: job.status,
    created_at: job.created_at,
    updated_at: job.updated_at
  }));
};

router.get('/', async (req, res, next) => {
  try {
    const { title, 'company-name': companyName } = req.query;
    let query = `
      SELECT 
        j.*, 
        c.name AS company_name, 
        c.location AS company_location, 
        cat.name AS category_name 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      JOIN categories cat ON j.category_id = cat.id 
      WHERE 1=1`;
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      query += ` AND j.title ILIKE $${values.length}`;
    }
    if (companyName) {
      values.push(`%${companyName}%`);
      query += ` AND c.name ILIKE $${values.length}`;
    }

    const { rows } = await pool.query(query, values);
    res.status(200).json({ status: 'success', data: { jobs: formatJobs(rows) } });
  } catch (err) { next(err); }
});

router.get('/company/:companyId', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        j.*, 
        c.name AS company_name, 
        c.location AS company_location, 
        cat.name AS category_name 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      JOIN categories cat ON j.category_id = cat.id 
      WHERE j.company_id = $1`, [req.params.companyId]);
    res.status(200).json({ status: 'success', data: { jobs: formatJobs(rows) } });
  } catch (err) { next(err); }
});

router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        j.*, 
        c.name AS company_name, 
        c.location AS company_location, 
        cat.name AS category_name 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      JOIN categories cat ON j.category_id = cat.id 
      WHERE j.category_id = $1`, [req.params.categoryId]);
    res.status(200).json({ status: 'success', data: { jobs: formatJobs(rows) } });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        j.*, 
        c.name AS company_name, 
        c.location AS company_location, 
        cat.name AS category_name 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      JOIN categories cat ON j.category_id = cat.id 
      WHERE j.id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Job tidak ditemukan' });

    res.status(200).json({ status: 'success', data: formatJobs(rows)[0] });
  } catch (err) { next(err); }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = JobSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const compId = value.companyId || value.company_id || req.body.companyId || req.body.company_id;
    const catId = value.categoryId || value.category_id || req.body.categoryId || req.body.category_id;

    if (!compId || !catId) return res.status(400).json({ status: 'failed', message: 'companyId dan categoryId wajib diisi' });

    const id = `job-${nanoid(16)}`;
    const salary = value.salary || req.body.salary || 0;
    const type = value.type || req.body.type || 'Full-time';
    const status = value.status || req.body.status || 'Open';

    await pool.query(
      'INSERT INTO jobs(id, title, description, company_id, category_id, user_id, salary, type, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [id, value.title, value.description, compId, catId, req.user.id, salary, type, status]
    );

    // PERBAIKAN UTAMA: Tambahkan companyId ke dalam object data
    res.status(201).json({
      status: 'success',
      message: 'Job berhasil ditambahkan',
      data: {
        jobId: id,
        id: id,
        companyId: compId,
        categoryId: catId
      }
    });
  } catch (err) { next(err); }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = JobSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const jobExist = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (!jobExist.rowCount) return res.status(404).json({ status: 'failed', message: 'Job tidak ditemukan' });

    const oldData = jobExist.rows[0];
    const title = value.title || oldData.title;
    const description = value.description || oldData.description;
    const compId = value.companyId || value.company_id || req.body.companyId || req.body.company_id || oldData.company_id;
    const catId = value.categoryId || value.category_id || req.body.categoryId || req.body.category_id || oldData.category_id;

    const salary = value.salary || req.body.salary || oldData.salary;
    const type = value.type || req.body.type || oldData.type;
    const status = value.status || req.body.status || oldData.status;

    await pool.query(
      'UPDATE jobs SET title = $1, description = $2, company_id = $3, category_id = $4, salary = $5, type = $6, status = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8',
      [title, description, compId, catId, salary, type, status, req.params.id]
    );

    // PERBAIKAN: Berikan juga ID di respons PUT untuk jaga-jaga
    res.status(200).json({
      status: 'success',
      message: 'Job berhasil diperbarui',
      data: {
        id: req.params.id,
        companyId: compId,
        categoryId: catId
      }
    });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Job tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Job berhasil dihapus' });
  } catch (err) { next(err); }
});

// --- RUTE BOOKMARKS ---
router.post('/:jobId/bookmark', authenticateToken, async (req, res, next) => {
  try {
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [req.params.jobId]);
    if (!jobCheck.rowCount) return res.status(404).json({ status: 'failed', message: 'Job tidak ditemukan' });

    const id = `bookmark-${nanoid(16)}`;
    await pool.query(
      'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3)',
      [id, req.user.id, req.params.jobId]
    );

    await deleteCache(`bookmarks:${req.user.id}`);
    res.status(201).json({ status: 'success', message: 'Bookmark berhasil ditambahkan', data: { bookmarkId: id, id: id } });
  } catch (err) { next(err); }
});

router.get('/:jobId/bookmark/:id', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND job_id = $2 AND user_id = $3',
      [req.params.id, req.params.jobId, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Bookmark tidak ditemukan' });
    res.status(200).json({ status: 'success', data: rows[0] });
  } catch (err) { next(err); }
});

router.delete('/:jobId/bookmark', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
      [req.params.jobId, req.user.id]
    );
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Bookmark tidak ditemukan' });

    await deleteCache(`bookmarks:${req.user.id}`);
    res.status(200).json({ status: 'success', message: 'Bookmark berhasil dihapus' });
  } catch (err) { next(err); }
});

module.exports = router;