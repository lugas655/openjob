const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { CategorySchema } = require('../utils/validator');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, description, created_at FROM categories');
    res.status(200).json({ status: 'success', data: { categories: rows } });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, description, created_at FROM categories WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Category tidak ditemukan' });

    // Sesuai Reviewer: Tidak ada pembungkus { category: ... }
    res.status(200).json({ status: 'success', data: rows[0] });
  } catch (err) { next(err); }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = CategorySchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const id = `category-${nanoid(16)}`;
    await pool.query('INSERT INTO categories(id, name, description) VALUES($1, $2, $3)', [id, value.name, value.description]);

    res.status(201).json({ status: 'success', message: 'Category berhasil ditambahkan', data: { categoryId: id, id: id } });
  } catch (err) { next(err); }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = CategorySchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const result = await pool.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING id', [value.name, value.description, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Category tidak ditemukan' });

    res.status(200).json({ status: 'success', message: 'Category berhasil diperbarui' });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Category tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Category berhasil dihapus' });
  } catch (err) { next(err); }
});

module.exports = router;