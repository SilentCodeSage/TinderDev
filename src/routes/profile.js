const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.currentUser);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

module.exports = profileRouter;
