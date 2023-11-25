const articleRouter = require("express").Router();

const {
  getArticlesByID,
  getAllArticles,
  patchArticleById,
  postNewComment,
  getCommentByArticleId,
  postNewArticle,
  deleteArticlesByID
} = require("../controllers/articles.controllers");


articleRouter.get("/", getAllArticles);
articleRouter.get("/:article_id", getArticlesByID);
articleRouter.delete("/:article_id", deleteArticlesByID);
articleRouter.get("/:article_id/comments", getCommentByArticleId);
articleRouter.post("/:article_id/comments", postNewComment);
articleRouter.patch("/:article_id", patchArticleById);
articleRouter.post("/", postNewArticle);

module.exports = articleRouter;
