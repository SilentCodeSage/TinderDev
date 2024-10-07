const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

//get the pending connection requests for the logged in user.
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: currentUser._id,
      status: "like",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "profileUrl",
      "about",
      "gender",
      "age",
    ]);

    res.send(connectionRequests);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

//get the logged in user accepted or existing connection
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: currentUser._id,
      status: "like",
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "profileUrl",
        "about",
        "gender",
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "profileUrl",
        "about",
        "gender",
        "age",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === currentUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send(data);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

module.exports = userRouter;
