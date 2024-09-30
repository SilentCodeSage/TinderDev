const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.currentUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatusTypes = ["like","pass"];

      const isToUserId = await User.findOne({
        toUserId
      });

      if(!isToUserId){
        throw new Error("User Not found");
      }

      if(!allowedStatusTypes.includes(status)){
        return res.status(400).json({message:"Invalid status type: "+status});
      }

      const existingConnectionRequests = await ConnectionRequest.findOne({
        $or:[
          {fromUserId, toUserId},
          {fromUserId:toUserId,toUserId:fromUserId},
        ]
      });

      if(existingConnectionRequests){
        throw new Error("Connection request send failed");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.send("Success");
    } catch (error) {
      res.send("Error: " + error.message);
    }
  }
);

module.exports = requestsRouter;
