const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const { getCache, setCache } = require('../utils/cache');
const router = express.Router();

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const cacheKey = `bookmarks:${req.user.id}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res
        .status(200)
        .set('X-Data-Source', 'cache')
        .json({
          status: 'success',
          data: { bookmarks: cachedData }
        });
    }

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

    await setCache(cacheKey, rows, 3600);

    res
      .status(200)
      .set('X-Data-Source', 'database')
      .json({
        status: 'success',
        data: { bookmarks: rows }
      });

  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: 'failed',
        message: 'Bookmark tidak ditemukan'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;