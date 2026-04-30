// lugas_hermanto_zVUj
const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { CompanySchema } = require('../utils/validator');
const authenticateToken = require('../middleware/auth');
const { getCache, setCache, deleteCache } = require('../utils/cache');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM companies');
    res.status(200).json({ status: 'success', data: { companies: rows } });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const cacheKey = `company:${req.params.id}`;
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return res.status(200)
        .set('X-Data-Source', 'cache')
        .json({ status: 'success', data: cachedData });
    }

    const { rows } = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Company tidak ditemukan' });
    
    await setCache(cacheKey, rows[0], 3600); // 1 hour cache
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: rows[0] });
  } catch (err) { next(err); }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = CompanySchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const id = `company-${nanoid(16)}`;
    // Menambahkan value.location ke dalam query INSERT
    await pool.query(
      'INSERT INTO companies(id, name, location, description) VALUES($1, $2, $3, $4)', 
      [id, value.name, value.location, value.description]
    );
    
    res.status(201).json({ status: 'success', message: 'Company berhasil ditambahkan', data: { companyId: id, id: id } });
  } catch (err) { next(err); }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = CompanySchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    // Menambahkan location = $2 ke dalam query UPDATE
    const result = await pool.query(
      'UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id', 
      [value.name, value.location, value.description, req.params.id]
    );
    
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Company tidak ditemukan' });
    
    await deleteCache(`company:${req.params.id}`);
    res.status(200).json({ status: 'success', message: 'Company berhasil diperbarui' });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Company tidak ditemukan' });
    
    await deleteCache(`company:${req.params.id}`);
    res.status(200).json({ status: 'success', message: 'Company berhasil dihapus' });
  } catch (err) { next(err); }
});

module.exports = router;