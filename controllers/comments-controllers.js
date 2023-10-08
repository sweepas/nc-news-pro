const {
  removeComment,
  patchCommentById,
} = require("../models/comments-models");

exports.editCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const { inc_votes } = req.body;
  patchCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
