// lugas_hermanto_zVUj
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Mengambil header Authorization
  const authHeader = req.headers['authorization'];
  
  // Mengambil token (karena formatnya "Bearer <token>")
  const token = authHeader && authHeader.split(' ')[1];

  // Skenario 1: Postman tidak mengirimkan token (No Token)
  if (!token) {
    return res.status(401).json({ 
      status: 'failed', 
      message: 'Akses ditolak, token tidak ditemukan' 
    });
  }

  // Skenario 2: Postman mengirim token palsu (Invalid Token)
  // Catatan: Pastikan nama variabel env kamu sesuai (ACCESS_TOKEN_KEY atau ACCESS_TOKEN_SECRET)
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY || process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ 
        status: 'failed', 
        message: 'Akses ditolak, token tidak valid' 
      });
    }
    
    // Jika lolos, masukkan data user ke request dan lanjut ke rute
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;