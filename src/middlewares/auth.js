const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decoded_idOfUser = await jwt.verify(token, "Nandakishor@Earth$1029");
    const currentUser = await User.findById({ _id: decoded_idOfUser._id });

    if (!currentUser) {
      throw new Error("User not Found");
    }

    req.currentUser = currentUser;
    next();
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  userAuth,
};
