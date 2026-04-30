exports.up = (pgm) => {
    pgm.addColumns('jobs', {
        salary: { type: 'INTEGER', default: 0 },
        type: { type: 'VARCHAR(50)', default: 'Full-time' },
        status: { type: 'VARCHAR(50)', default: 'Open' },
    });
};

exports.down = (pgm) => {
    pgm.dropColumns('jobs', ['salary', 'type', 'status']);
};
