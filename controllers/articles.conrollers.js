const {
  fetchArticlesById,
  fetchAllArticles,
  insertNewComment,
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

exports.postNewComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  insertNewComment(articleId, username, body)
    .then((result) => {
      console.log(comment);
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
