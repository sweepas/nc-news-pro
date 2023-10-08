const usersRouter = require("express").Router();

const { getAllUsers, getUser } = require("../controllers/users.controllers");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUser);

module.exports = usersRouter;
