const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((results) => {
      if (!results.rows[0])
        return Promise.reject({ status: 404, msg: "not found" });
      return results.rows[0];
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `
    )
    .then((results) => {
      return results.rows;
    });
};

exports.insertNewComment = (article_id, body, username) => {
  const insertValues = [body, username, article_id];

  const query = `INSERT INTO comments (body, author, article_id)
  VALUES ($1, $2, $3) RETURNING *`;

  return db.query(query, insertValues).then((results) => {
    return results.rows[0];
  });
};

exports.editArticleById = (article_id, inc_votes) => {
  const insertValues = [inc_votes, article_id];
  const query = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;
  return db.query(query, insertValues).then((results) => {
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
