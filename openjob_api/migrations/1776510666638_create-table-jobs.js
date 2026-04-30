exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'VARCHAR(150)', notNull: true },
    description: { type: 'TEXT', notNull: true },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'cascade'
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};