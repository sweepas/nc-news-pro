const db = require("../db/connection");

exports.patchCommentById = (comment_id, inc_votes) => {
  const insertValues = [comment_id];
  if (inc_votes === undefined) {
    insertValues.unshift(0);
  } else insertValues.unshift(inc_votes);
  const query = `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`;
  return db.query(query, insertValues).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return results.rows[0];
  });
};

exports.removeComment = (comment_id) => {
  if (!+comment_id)
    return Promise.reject({ status: 400, msg: "Invalid input" });
  const insertValues = [comment_id];
  const query = `DELETE FROM comments
    WHERE comment_id = $1`;
  return db.query(query, insertValues).then((results) => {
    if (results.rowCount === 0)
      return Promise.reject({ status: 404, msg: "Not Found" });
  });
};
