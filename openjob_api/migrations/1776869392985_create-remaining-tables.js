// migrations/[timestamp]_create-remaining-tables.js
exports.up = (pgm) => {
  // Tabel Applications (Relasi User dan Job)
  pgm.createTable('applications', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    job_id: { type: 'VARCHAR(50)', notNull: true, references: '"jobs"', onDelete: 'cascade' },
    status: { type: 'VARCHAR(20)', notNull: true, defaultValue: 'pending' }, // pending, accepted, rejected
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Tabel Bookmarks (Relasi User dan Job)
  pgm.createTable('bookmarks', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    job_id: { type: 'VARCHAR(50)', notNull: true, references: '"jobs"', onDelete: 'cascade' },
  });

  // Tabel Documents
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    filename: { type: 'TEXT', notNull: true },
    path: { type: 'TEXT', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
  pgm.dropTable('bookmarks');
  pgm.dropTable('applications');
};