const { fetchAllTopics, fetchApiInfo } = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApiInfo = (req, res, next) => {
  fetchApiInfo()
    .then((apiInfo) => {
      res.status(200).send({ apiInfo });
    })
    .catch((err) => {
      next(err);
    });
};
