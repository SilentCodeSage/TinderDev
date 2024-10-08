const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
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

    console.log(connectionRequests);

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;

    const page = parseInt(req.query.page) | 1;
    const limit = parseInt(req.query.limit) | 10;
    skip = (page - 1) * limit;

    const usersToHideFromfeedInfo = await ConnectionRequestModel.find({
      $or: [{ toUserId: currentUser._id }, { fromUserId: currentUser._id }],
    });
    const usersToHideFromfeed = new Set();

    usersToHideFromfeedInfo.forEach((data) => {
      usersToHideFromfeed.add(data.fromUserId.toString());
      usersToHideFromfeed.add(data.toUserId.toString());
    });

    const usersToShowInFeed = await User.find({
      $and: [
        { _id: { $nin: usersToHideFromfeed } },
        { _id: { $ne: currentUser._id } },
      ],
    }).select([
      "firstName",
      "lastName",
      "profileUrl",
      "about",
      "gender",
      "age",
    ]).skip(skip).limit(limit);
    console.log(usersToHideFromfeed);
    res.send(usersToHideFromfeed);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

module.exports = userRouter;
