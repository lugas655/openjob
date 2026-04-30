# OpenJob - Full-Stack Job Platform

OpenJob adalah platform pencarian kerja full-stack yang mencakup layanan API, sistem pengolahan pesan latar belakang (consumer), dan antarmuka web modern. Proyek ini dibangun untuk memenuhi standar aplikasi skalabel dengan arsitektur microservices sederhana.

## 🚀 Fitur Utama
- **Manajemen Lowongan**: Pembuatan, pembaruan, dan penghapusan lowongan kerja.
- **Sistem Kategori**: Pengorganisasian lowongan berdasarkan kategori industri.
- **Manajemen Perusahaan**: Profil perusahaan yang terintegrasi dengan lowongan.
- **Sistem Lamaran**: Pengguna dapat melamar pekerjaan dan mengunggah dokumen pendukung.
- **Caching & Messaging**: Menggunakan Redis untuk caching dan RabbitMQ untuk pengiriman notifikasi/email di latar belakang.
- **Dashboard Admin**: Panel kontrol untuk mengelola data master (Kategori, Perusahaan, Lowongan).

## 📂 Struktur Proyek
Repositori ini terdiri dari tiga bagian utama:

1.  **`openjob_api`**: Layanan backend utama yang menyediakan RESTful API menggunakan Node.js, Express, dan PostgreSQL.
2.  **`openjob_consumer`**: Layanan worker yang memproses antrean pesan dari RabbitMQ.
3.  **`openjob_web`**: Antarmuka frontend yang responsif dibangun dengan React.js dan Vite.

## 🛠️ Teknologi yang Digunakan
- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Vite, TailwindCSS
- **Database**: PostgreSQL
- **Caching**: Redis
- **Message Broker**: RabbitMQ
- **Authentication**: JSON Web Token (JWT)

## ⚙️ Cara Menjalankan

### Prasyarat
Pastikan Anda sudah menginstal:
- Node.js (v16 atau terbaru)
- PostgreSQL
- Redis
- RabbitMQ

### 1. Setup Backend (API)
```bash
cd openjob_api
npm install
# Salin .env.example ke .env dan sesuaikan konfigurasinya
npm run migrate up
npm run start
```

### 2. Setup Consumer
```bash
cd openjob_consumer
npm install
npm start
```

### 3. Setup Frontend
```bash
cd openjob_web
npm install
npm run dev
```

## 📝 Lisensi
Proyek ini dibuat untuk tujuan pembelajaran dan submisi tugas jangan lasung mengumpul file ini karena akan terkena plagiarisme, jadikan sebagai pembelajaran untuk project anda.
