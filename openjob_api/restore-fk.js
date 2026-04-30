const pool = require('./src/config/database');

async function restoreFK() {
  try {
    console.log('Restoring foreign key constraint...');
    await pool.query(`
      ALTER TABLE applications 
      ADD CONSTRAINT applications_job_id_fkey 
      FOREIGN KEY (job_id) REFERENCES jobs(id) 
      ON DELETE CASCADE
    `);
    console.log('✅ Foreign key constraint restored successfully!');
  } catch (err) {
    if (err.code === '42710') {
      console.log('ℹ️ Foreign key constraint already exists.');
    } else {
      console.error('❌ Error restoring foreign key:', err.message);
    }
  } finally {
    await pool.end();
  }
}

restoreFK();
