// lugas_hermanto_zVUj
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { LoginSchema } = require('../utils/validator');
const TokenManager = require('../utils/tokenManager');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = LoginSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const { email, password } = value;
    const userResult = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
    
    // Dicoding biasanya minta 401 untuk salah email/password
    if (userResult.rowCount === 0) return res.status(401).json({ status: 'failed', message: 'Kredensial yang Anda berikan salah' });

    const match = await bcrypt.compare(password, userResult.rows[0].password);
    if (!match) return res.status(401).json({ status: 'failed', message: 'Kredensial yang Anda berikan salah' });

    const accessToken = TokenManager.generateAccessToken({ id: userResult.rows[0].id });
    const refreshToken = TokenManager.generateRefreshToken({ id: userResult.rows[0].id });

    await pool.query('INSERT INTO authentications(token) VALUES($1)', [refreshToken]);

    res.status(200).json({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: { accessToken, refreshToken },
    });
  } catch (err) { next(err); }
});

router.put('/', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ status: 'failed', message: 'Refresh token tidak ditemukan' });

    const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [refreshToken]);
    if (result.rowCount === 0) return res.status(400).json({ status: 'failed', message: 'Refresh token tidak valid di database' });

    let decoded;
    try {
      // PERBAIKAN: Tangkap error JWT agar tidak mematikan server
      decoded = TokenManager.verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(400).json({ status: 'failed', message: 'Refresh token tidak valid' });
    }

    const accessToken = TokenManager.generateAccessToken({ id: decoded.id });

    res.status(200).json({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: { accessToken },
    });
  } catch (err) { next(err); }
});

router.delete('/', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ status: 'failed', message: 'Refresh token tidak ditemukan' });

    const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [refreshToken]);
    if (result.rowCount === 0) return res.status(400).json({ status: 'failed', message: 'Refresh token tidak valid di database' });

    await pool.query('DELETE FROM authentications WHERE token = $1', [refreshToken]);
    
    res.status(200).json({ status: 'success', message: 'Refresh token berhasil dihapus' });
  } catch (err) { next(err); }
});

module.exports = router;