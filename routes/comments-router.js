const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  editCommentById,
} = require("../controllers/comments-controllers");

commentsRouter.patch("/:comment_id", editCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
