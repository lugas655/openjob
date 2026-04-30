// lugas_hermanto_zVUj
exports.up = (pgm) => {
  // Menambahkan kolom category_id ke tabel jobs yang sudah ada
  pgm.addColumn('jobs', {
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  // Membatalkan penambahan kolom (jika terjadi rollback)
  pgm.dropColumn('jobs', 'category_id');
};