const db = require("../db/connection");

exports.fetchAllTopics = (req) => {
  return db.query(`SELECT * FROM topics`).then((results) => {
    return results.rows;
  });
};
