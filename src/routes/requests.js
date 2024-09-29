const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestsRouter.post("sendConnectionRequest", userAuth, (req, res) => {
  const currentUser = req.currentUser;
  res.send(currentUser.firstName + "sent a connection request");
});

module.exports = requestsRouter;
