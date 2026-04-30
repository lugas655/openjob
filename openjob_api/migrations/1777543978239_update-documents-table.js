exports.up = (pgm) => {
    pgm.addColumns('documents', {
        original_name: { type: 'TEXT', notNull: false },
        size: { type: 'INTEGER', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    }, { ifNotExists: true });
};

exports.down = (pgm) => {
    pgm.dropColumns('documents', ['original_name', 'size', 'created_at'], { ifExists: true });
};
