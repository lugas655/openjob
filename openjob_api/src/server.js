// lugas_hermanto_zVUj
require('dotenv').config();
const express = require('express');
const pool = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// 1. IMPORT SEMUA ROUTES
const usersRoutes = require('./routes/users');
const authenticationsRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const categoriesRoutes = require('./routes/categories');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications'); // KABEL APLIKASI
const bookmarksRoutes = require('./routes/bookmarks');
const documentsRoutes = require('./routes/documents');
const profileRoutes = require('./routes/profile');

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 2. DAFTARKAN SEMUA ROUTES KE EXPRESS
app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/companies', companiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes); // AKTIFKAN KABEL APLIKASI
app.use('/bookmarks', bookmarksRoutes);
app.use('/documents', documentsRoutes);
app.use('/profile', profileRoutes);

// Penanganan 404 Global (Jika rute tidak ditemukan)
app.use((req, res) => {
  res.status(404).json({ status: 'failed', message: 'Resource tidak ditemukan' });
});

// Penanganan Error Server Global
app.use(errorHandler);

const init = async () => {
  // Postman Dicoding biasanya menggunakan port 3000 atau 5000
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000; 

  app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
};

init();