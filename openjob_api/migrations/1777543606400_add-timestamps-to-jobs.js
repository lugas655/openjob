exports.up = (pgm) => {
    pgm.addColumns('jobs', {
        created_at: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('jobs', 'created_at');
    pgm.dropColumn('jobs', 'updated_at');
};
