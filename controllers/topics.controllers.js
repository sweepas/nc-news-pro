const { fetchAllTopics } = require("../models/topics.models");
const fs = require("fs/promises");
const path = require("path");

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
  const endpointsDataPath = path.resolve(__dirname, "../endpoints.json");
  return fs
    .readFile(endpointsDataPath, "utf-8")
    .then((data) => {
      const apiInfo = JSON.parse(data);
      res.status(200).send({ apiInfo });
    })
    .catch((err) => {
      next(err);
    });
};
