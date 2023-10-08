const apiRouter = require("express").Router();

const {
  getAllTopics,
  getApiInfo,
} = require("../controllers/topics.controllers");

apiRouter.get("/", getApiInfo);
apiRouter.get("/topics", getAllTopics);

module.exports = apiRouter;
