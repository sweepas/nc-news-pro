const articleRouter = require("express").Router();

const {
  getArticlesByID,
  getAllArticles,
  patchArticleById,
  postNewComment,
  getCommentByArticleId,
  postNewArticle,
} = require("../controllers/articles.controllers");

articleRouter.get("/:article_id", getArticlesByID);
articleRouter.get("/", getAllArticles);
articleRouter.get("/:article_id/comments", getCommentByArticleId);
articleRouter.post("/:article_id/comments", postNewComment);
articleRouter.patch("/:article_id", patchArticleById);
articleRouter.post("/", postNewArticle);

module.exports = articleRouter;
