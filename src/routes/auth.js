const express = require("express");
const { validateUserSignup } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  //creating a new instance of a the UserModel
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    validateUserSignup(req.body);
    await user.save();
    res.send("User info added succesfully");
  } catch (error) {
    res.status(400).send("Creating new User Failed. " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });
  try {
    //checks if email is valid
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      //checks if password is valid
      const isPasswordCorrect = await user.PasswordValidator(password);
      if (isPasswordCorrect) {
        //creates a token by ofloading the token creation logic to shcema method
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login Successfull");
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

authRouter.post("/logout", async(req,res) =>{
    res.clearCookie("token");
    res.send("User Logged Out Succesfully");
})

module.exports = authRouter;
