exports.up = (pgm) => {
    // Menghapus data duplikat yang mungkin sudah ada sebelum menambahkan constraint
    pgm.sql(`
    DELETE FROM applications a
    WHERE a.id NOT IN (
      SELECT MIN(id)
      FROM applications
      GROUP BY user_id, job_id
    )
  `);

    pgm.addConstraint('applications', 'unique_user_job', {
        unique: ['user_id', 'job_id'],
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint('applications', 'unique_user_job');
};
