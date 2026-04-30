// lugas_hermanto_zVUj
exports.up = (pgm) => {
  // 1. Tabel Jobs (Pekerjaan)
  pgm.createTable('jobs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'VARCHAR(100)', notNull: true },
    description: { type: 'TEXT', notNull: true },
    company_id: { type: 'VARCHAR(50)', notNull: true, references: '"companies"', onDelete: 'cascade' },
    category_id: { type: 'VARCHAR(50)', notNull: true, references: '"categories"', onDelete: 'cascade' },
  }, { ifNotExists: true });

  // 2. Tabel Applications (Lamaran)
  pgm.createTable('applications', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    job_id: { type: 'VARCHAR(50)', notNull: true, references: '"jobs"', onDelete: 'cascade' },
    status: { type: 'VARCHAR(20)', notNull: true, default: 'pending' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, { ifNotExists: true });

  // 3. Tabel Bookmarks (Simpanan)
  pgm.createTable('bookmarks', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    job_id: { type: 'VARCHAR(50)', notNull: true, references: '"jobs"', onDelete: 'cascade' },
  }, { ifNotExists: true });

  // 4. Tabel Documents (Dokumen CV dll)
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    filename: { type: 'TEXT', notNull: true },
    path: { type: 'TEXT', notNull: true },
  }, { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('documents', { ifExists: true });
  pgm.dropTable('bookmarks', { ifExists: true });
  pgm.dropTable('applications', { ifExists: true });
  pgm.dropTable('jobs', { ifExists: true });
};