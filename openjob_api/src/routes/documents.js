// lugas_hermanto_zVUj
const express = require('express');
const multer = require('multer');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});

router.post('/', authenticateToken, upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', message: 'File is required' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ status: 'failed', message: 'Hanya file PDF yang diperbolehkan' });
    }

    const id = `doc-${nanoid(16)}`;
    const generatedFilename = `${id}.pdf`;
    const filePath = path.join(__dirname, '../../uploads', generatedFilename);

    // Simpan file ke disk agar bisa di-download nantinya
    fs.writeFileSync(filePath, req.file.buffer);

    await pool.query(
      'INSERT INTO documents(id, user_id, filename, original_name, size, path) VALUES($1, $2, $3, $4, $5, $6)',
      [id, req.user.id, generatedFilename, req.file.originalname, req.file.size, filePath]
    );

    res.status(201).json({ 
      status: 'success', 
      data: { 
        documentId: id,
        filename: generatedFilename,
        originalName: req.file.originalname,
        size: req.file.size
      } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /documents (PUBLIC)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        id, 
        filename, 
        original_name AS "originalName", 
        size 
      FROM documents`
    );
    res.status(200).json({ status: 'success', data: { documents: rows } });
  } catch (err) { next(err); }
});

// GET /documents/:id (VIEW/DOWNLOAD PDF - PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    // Mencoba mendownload file berdasarkan ID (format id.pdf di folder uploads)
    const filePath = path.join(__dirname, '../../uploads', `${id}.pdf`);

    res.download(filePath, `${id}.pdf`, (err) => {
      if (err) {
        if (!res.headersSent) {
          return res.status(404).json({
            status: 'failed',
            message: 'Document not found'
          });
        }
      }
    });
  } catch (err) { next(err); }
});

// GET /documents/:id/file (Menampilkan berkas)
router.get('/:id/file', async (req, res, next) => {
  const path = require('path');
  try {
    const { rows } = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ status: 'failed', message: 'Dokumen tidak ditemukan' });
    
    const file = rows[0];
    const filePath = path.resolve(file.path);
    res.sendFile(filePath);
  } catch (err) { next(err); }
});

// DELETE /documents/:id (PROTECTED)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    // Catatan: Di dunia nyata, kita juga harus menghapus file fisik di folder 'uploads' menggunakan modul 'fs' bawaan Node.js
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ status: 'failed', message: 'Dokumen tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Dokumen berhasil dihapus' });
  } catch (err) { next(err); }
});
module.exports = router;