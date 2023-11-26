const {
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  editArticleById,
  insertNewComment,
  addNewArticle,
} = require("../models/articles.models");

exports.getArticlesByID = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sortby, order } = req.query;
  fetchAllArticles(topic, sortby, order)
    .then((data) => {
      const articles = { articles: data };
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  insertNewComment(articleId, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes } = req.body;
  editArticleById(articleId, inc_votes)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  addNewArticle(author, title, body, topic, article_img_url)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
