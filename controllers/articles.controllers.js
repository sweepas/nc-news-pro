const {
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  editArticleById,
  insertNewComment,
  addNewArticle,
  removeArticleAndComments,
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
  const { topic, sortby, order, limit, page } = req.query;

  fetchAllArticles(topic, sortby, order, limit, page)
    .then((data) => {
      const total_count = data.length;
      res.status(200).send({ articles: data, total_count: total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { page, limit } = req.query;
  fetchCommentsByArticleId(article_id, page, limit)
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

exports.deleteArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleAndComments(article_id)
    .then(() => {
      res.status(204).send({ msg: "article deleted" });
    })
    .catch((err) => {
      next(err);
    });
};
