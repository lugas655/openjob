const express = require('express');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { UserRegisterSchema } = require('../utils/validator');
const { getCache, setCache, deleteCache } = require('../utils/cache');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = UserRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'failed', message: error.details[0].message });

    const finalName = value.name || value.fullname || 'User';
    const { email, password } = value;

    const userResult = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userResult.rowCount > 0) return res.status(400).json({ status: 'failed', message: 'Email sudah digunakan' });

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users(id, email, password, fullname) VALUES($1, $2, $3, $4)', [id, email, hashedPassword, finalName]);

    res.status(201).json({ status: 'success', message: 'User berhasil ditambahkan', data: { userId: id, id: id } });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const cacheKey = `user:${req.params.id}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200)
        .set('X-Data-Source', 'cache')
        .json({ status: 'success', data: cachedData });
    }

    const { rows } = await pool.query('SELECT id, email, fullname, fullname AS name FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'User tidak ditemukan' });
    
    const user = rows[0];
    user.role = 'user'; 
    
    await setCache(cacheKey, user, 3600); // 1 hour cache
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: user });
  } catch (err) { next(err); }
});

// Update user (added just to ensure cache invalidation is possible)
router.put('/:id', async (req, res, next) => {
  try {
    const { fullname } = req.body;
    if (!fullname) return res.status(400).json({ status: 'failed', message: 'Fullname required' });

    const result = await pool.query('UPDATE users SET fullname = $1 WHERE id = $2 RETURNING id', [fullname, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'User tidak ditemukan' });

    await deleteCache(`user:${req.params.id}`);
    res.status(200).json({ status: 'success', message: 'User berhasil diperbarui' });
  } catch (err) { next(err); }
});

module.exports = router;