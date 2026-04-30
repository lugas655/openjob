exports.up = (pgm) => {
    const tables = ['companies', 'categories', 'bookmarks', 'users'];
    tables.forEach(table => {
        pgm.addColumns(table, {
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
        }, { ifNotExists: true });
    });
};

exports.down = (pgm) => {
    const tables = ['companies', 'categories', 'bookmarks', 'users'];
    tables.forEach(table => {
        pgm.dropColumn(table, 'created_at', { ifExists: true });
        pgm.dropColumn(table, 'updated_at', { ifExists: true });
    });
};
