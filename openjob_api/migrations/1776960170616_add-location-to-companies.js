// lugas_hermanto_zVUj
exports.up = (pgm) => {
  pgm.addColumn('companies', {
    location: {
      type: 'VARCHAR(255)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('companies', 'location');
};