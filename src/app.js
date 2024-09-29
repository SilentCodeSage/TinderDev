const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {
  validateUserSignup,
  validateUserUpdate,
} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const requestsRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);

//view specific user info
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const currentUser = await User.findOne({ emailId: userEmail });
    if (!currentUser) {
      res.status(400).send("Error fetching the user info");
    } else {
      res.send(currentUser);
    }
  } catch (error) {
    res.status(400).send("Error fetching the user info");
  }
});

//view all users feed
app.get("/feed", async (req, res) => {
  try {
    const usersList = await User.find({});
    res.send(usersList);
  } catch (error) {
    res.status(400).send("Error fetching the user info" + error);
  }
});

//delelte user by the user id
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    res.send("User deleted succesfully");
  } catch (error) {
    res.status(400).send("User Deletion failed !" + error);
  }
});

//update the user
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    validateUserUpdate(data);
    const usersList = await User.updateMany(
      {
        _id: userId,
      },
      data,
      { runValidators: true }
    );
    res.send(usersList);
  } catch (error) {
    res.status(400).send("Update Failed." + error.message);
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
