const express = require("express");
const { getAllTopics, getApiInfo } = require("./controllers/topics.contollers");
const { getArticlesByID } = require("./controllers/articles.conrollers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getApiInfo);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "wrong path" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
