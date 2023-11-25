const apiRouter = require("express").Router();

const {
  getAllTopics,
  getApiInfo,
  postTopic,
} = require("../controllers/topics.controllers");

apiRouter.get("/", getApiInfo);
apiRouter.get("/topics", getAllTopics);
apiRouter.post("/topics", postTopic);

module.exports = apiRouter;
