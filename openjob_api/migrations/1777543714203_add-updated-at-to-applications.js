exports.up = (pgm) => {
    pgm.addColumn('applications', {
        updated_at: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('applications', 'updated_at');
};
