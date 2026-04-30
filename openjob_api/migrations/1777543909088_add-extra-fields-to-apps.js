exports.up = (pgm) => {
    pgm.addColumns('applications', {
        cover_letter: { type: 'TEXT' },
        resume: { type: 'TEXT' },
    });
};

exports.down = (pgm) => {
    pgm.dropColumns('applications', ['cover_letter', 'resume']);
};
