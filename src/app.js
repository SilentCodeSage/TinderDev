const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//user signup
app.post("/signup", async (req, res) => {
  //creating a new instance of a the UserModel

  try {
    const data = req.body;
    const user = new User(data);
    const requiredFields = ["firstName", "lastName", "emailId", "password"];

    const isrequiredFeilds = Object.keys(data).every((k) => {
      return requiredFields.includes(k);
    });

    if (!isrequiredFeilds) {
      throw new Error("req format error");
    }
    await user.save();
    res.send("User info added succesfully");
  } catch (error) {
    res.status(400).send("Creating new User Failed. " + error.message);
  }
});

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

//update user
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const allowedUpdateFields = [
      "profileUrl",
      "about",
      "age",
      "skills",
      "password",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      return allowedUpdateFields.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("Cannot Update the provided fields.");
    }
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
