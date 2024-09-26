const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //creating a new instance of a the UserModel
  const user = new User({
    firstName: "Nandakishor",
    lastName: "A S",
    emailId: "nandunandakishor345@gmail.com",
    password: "Nandu@123",
  });

  try {
    await user.save();
    res.send("User info added succesfully");
  } catch (error) {
    res.status(400).send("Error saving the instance");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(3001, () => {
      console.log("Server @ port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection to database failed");
  });
