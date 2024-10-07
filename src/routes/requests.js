const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//sendConnectionRequest => like or pass
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.currentUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isToUserIdPresent = await User.findOne({
        _id: toUserId,
      });

      if (!isToUserIdPresent) {
        throw new Error("User Not found");
      }

      const allowedStatusTypes = ["like", "pass"];

      if (!allowedStatusTypes.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Check if a connection request already exists between the two users,
      // either sent by the current user to the recipient or received from the recipient.
      const existingConnectionRequests = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      //checks if already a connection req exists or not
      if (existingConnectionRequests) {
        throw new Error(
          "Connection request failed.A connection already exists."
        );
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.send("Success " + data);
    } catch (error) {
      res.send("Error: " + error.message);
    }
  }
);

//review the connection request => accept or reject
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const currentUser = req.currentUser;

      const allowedStatusTypes = ["accepted", "rejected"];

      if (!allowedStatusTypes.includes(status)) {
        throw new Error("Invalid Status: "+status);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: currentUser._id.toString(),
        status: "like",
      });

      if (!connectionRequest) {
        throw new Error("Cannot find user");
      }

      connectionRequest.status = status;
      await connectionRequest.save();
      res.send("acccepted");
    } catch (error) {
      res.send("Error: " + error.message);
    }
  }
);

module.exports = requestsRouter;
