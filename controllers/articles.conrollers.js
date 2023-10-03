const {
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
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
  fetchAllArticles()
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
