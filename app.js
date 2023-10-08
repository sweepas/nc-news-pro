const express = require("express");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const apiRouter = require("./routes/api-router");
const articleRouter = require("./routes/article-router");
const commentsRouter = require("./routes/comments-router");
const usersRouter = require("./routes/user-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "wrong path" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
