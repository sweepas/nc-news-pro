const express = require("express");
const { getAllTopics, getApiInfo } = require("./controllers/topics.contollers");

const {
  getArticlesByID,
  getAllArticles,
  patchArticleById,
  postNewComment,
} = require("./controllers/articles.conrollers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api", getApiInfo);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticlesByID);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postNewComment);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "wrong path" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
