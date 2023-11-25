const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
  const query = `
SELECT
  articles.author,
  articles.title,
  articles.article_id,
  articles.body,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.article_id) AS comment_count
FROM
  articles
LEFT JOIN
  comments ON articles.article_id = comments.article_id
  WHERE
      articles.article_id = $1
    GROUP BY
      articles.article_id;
  `;

  return db.query(query, [article_id]).then((results) => {
    if (!results.rows[0])
      return Promise.reject({ status: 404, msg: "not found" });
    return results.rows[0];
  });
};

exports.fetchAllArticles = (topic, sortby, order = "DESC", limit, page) => {
  const validInput = {
    author: "author",
    topic: "topic",
    createdAt: "created_at",
    title: "title",
    article_id: "article_id",
    votes: "votes",
    comment_count: "comment_count",
  };
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id) AS comment_count
    FROM
      articles
    LEFT JOIN
      comments ON articles.article_id = comments.article_id
  `;

  const values = [];

  if (topic) {
    query += `WHERE topic = $1`;

    values.push(topic);
  }

  const validSortBy = validInput[sortby] || "created_at";
  query += `
    GROUP BY articles.article_id
    ORDER BY ${validSortBy} ${order}
  `;
  if (page || limit) {
    if (
      (page !== undefined && (isNaN(page) || page < 1)) ||
      (limit !== undefined && (isNaN(limit) || limit < 1))
    ) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }

    if (limit === undefined) limit = 10;
    if (page === undefined) page = 1;
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }
  query += ";";
  return db.query(query, values).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
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
  const insertValues = [article_id];
  if (inc_votes === undefined) {
    insertValues.unshift(0);
  } else insertValues.unshift(inc_votes);
  const query = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;
  return db.query(query, insertValues).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return results.rows[0];
  });
};

exports.fetchCommentsByArticleId = (article_id, page, limit) => {
  let query = `SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`;
  //console.log(isNaN(page));
  if (page || limit) {
    if (
      (page !== undefined && (isNaN(page) || page < 1)) ||
      (limit !== undefined && (isNaN(limit) || limit < 1))
    ) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    if (limit === undefined) limit = 10;
    if (page === undefined) page = 1;
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }
  query += ";";
  return db.query(query, [article_id]).then((results) => {
    if (!results.rows[0]) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return results.rows;
  });
};

exports.addNewArticle = (author, title, body, topic, article_img_url) => {
  const regex = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g);
  if (!regex.test(article_img_url) || !article_img_url) {
    article_img_url =
      "https://jobs.ficsi.in/assets/front_end/images/no-image-found.jpg";
  }

  const insertValues = [author, title, body, topic, article_img_url];
  let query = `INSERT INTO articles (author, title, body, topic, article_img_url) 
  VALUES ($1, $2, $3, $4, $5)
  RETURNING article_id, votes, created_at, 
  (SELECT COUNT(*) FROM comments WHERE article_id = articles.article_id) AS comment_count;`;
  return db.query(query, insertValues).then((results) => {
    return results.rows[0];
  });
};
