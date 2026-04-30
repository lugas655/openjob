exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    email: { type: 'VARCHAR(100)', notNull: true, unique: true }, // Memenuhi syarat Unique Constraint
    password: { type: 'TEXT', notNull: true },
    fullname: { type: 'VARCHAR(100)', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};