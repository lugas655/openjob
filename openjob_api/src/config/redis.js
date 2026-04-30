const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis: Batas maksimal reconnect tercapai. Fitur cache tidak tersedia.');
        return false; // Hentikan percobaan reconnect
      }
      // Tunggu (retries * 500)ms sebelum mencoba lagi, max 5 detik
      return Math.min(retries * 500, 5000);
    }
  }
});

client.on('error', (err) => {
  // Hanya tampilkan kode error, bukan full stack trace, agar log lebih bersih
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Client Error:', err.message);
  }
});
client.on('connect', () => console.log('Redis Client Connected'));
client.on('reconnecting', () => console.log('Redis Client Reconnecting...'));

// Connecting immediately — gunakan catch agar server tidak crash jika Redis tidak tersedia
client.connect().catch((err) => {
  console.warn('Redis tidak tersedia saat startup. Fitur cache dinonaktifkan sementara.');
});

module.exports = client;
