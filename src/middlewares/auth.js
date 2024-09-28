const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decoded_idOfUser = await jwt.verify(token, "Nandakishor@Earth$1029");
    const currentUser = await User.findById({ _id: decoded_idOfUser._id });

    if (!currentUser) {
      throw new Error("User not Found");
    } 

        req.currentUser = currentUser;
        console.log("yes")
        next();
  } catch (error) {
    res.send("Error: "+error.message);
  }
};

module.exports = {
  userAuth,
};
