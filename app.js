const express = require("express");
const { getAllTopics, getApiInfo } = require("./controllers/topics.contollers");
const { getAllArticles } = require("./controllers/articles.conrollers");
const app = express();

app.get("/api", getApiInfo);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "wrong path" });
});

app.use((err, req, res, next) => {
  if (err) res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
