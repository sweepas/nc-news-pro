const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((results) => {
    return results.rows;
  });
};

exports.addNewTopic = (slug, description) => {
  if (
    !slug ||
    !description ||
    typeof slug !== "string" ||
    typeof description !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const insertValues = [slug, description];
  return db
    .query(
      `INSERT INTO topics (slug, description)
  values ($1, $2)
  RETURNING slug;`,
      insertValues
    )
    .then((results) => {
      return results.rows[0];
    });
};
