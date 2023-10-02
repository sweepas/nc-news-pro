const express = require("express");
const { getAllTopics } = require("./topics.controllers");
const app = express();

app.get("/api/topics", getAllTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "wrong path" });
});

app.use((err, req, res, next) => {
  if (err) res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
