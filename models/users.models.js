const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((results) => {
    return results.rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1;`, [username])
    .then((results) => {
      return results.rows[0];
    });
};
