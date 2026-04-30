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

## ⚙️ Konfigurasi Environment

Sebelum menjalankan aplikasi, pastikan Anda telah membuat file `.env` di masing-masing direktori layanan.

### 1. Backend (`openjob_api`)
Buat file `.env` di folder `openjob_api/`:
```env
# Database
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=password_anda
PGDATABASE=openjob
PGPORT=5432

# Authentication
ACCESS_TOKEN_KEY=rahasia_token_akses
REFRESH_TOKEN_KEY=rahasia_token_refresh
TOKEN_AGE=3600

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# Redis
REDIS_SERVER=localhost
```

### 2. Consumer (`openjob_consumer`)
Buat file `.env` di folder `openjob_consumer/`:
```env
# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# Mail Service (Gunakan Mailtrap atau Gmail App Password)
MAIL_ADDRESS=email_anda@gmail.com
MAIL_PASSWORD=password_aplikasi_anda
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
```

### 3. Frontend (`openjob_web`)
Buat file `.env` di folder `openjob_web/`:
```env
# API URL (Tanpa akhiran garis miring)
VITE_API_URL=http://localhost:3000
```

---

## 🛠️ Cara Menjalankan

### 1. Setup Backend (API)
```bash
cd openjob_api
npm install
npm run migrate up
npm run dev
```

### 2. Setup Consumer
```bash
cd openjob_consumer
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd openjob_web
npm install
npm run dev
```

## 📝 Lisensi
Proyek ini dibuat untuk tujuan pembelajaran. Harap jadikan sebagai referensi dan jangan langsung mengumpulkan file ini untuk menghindari plagiarisme.
