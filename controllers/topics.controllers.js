const { log } = require("console");
const { fetchAllTopics, addNewTopic } = require("../models/topics.models");
const fs = require("fs/promises");
const path = require("path");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      console.log(err);
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

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  addNewTopic(slug, description)
    .then((data) => {
      res.status(201).send({ topic: data.slug });
    })
    .catch((err) => {
      next(err);
    });
};
