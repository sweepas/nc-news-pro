const {
  fetchArticlesById,
  fetchAllArticles,
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
  fetchAllArticles().then((results) => {
    res.status(200).send(results);
  });
};
