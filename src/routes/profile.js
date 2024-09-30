const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEdit,
  validateProfileEditPassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

//view the currently logged user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.currentUser);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

//Edit the user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEdit(req);
    const currentUser = req.currentUser;

    Object.keys(req.body).forEach((key) => {
      currentUser[key] = req.body[key];
    });

    await currentUser.save();
    res.send("Updated user profile succesfully\n" + currentUser);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

//Change the password
profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    validateProfileEditPassword(req);
    const currentUser = req.currentUser;
    const { password } = req.body;
    currentUser["password"] = await bcrypt.hash(password, 10);
    await currentUser.save();
    res.send("Password Changed Succesfully");
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

module.exports = profileRouter;
