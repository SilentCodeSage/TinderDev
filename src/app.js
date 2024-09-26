const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//user signup
app.post("/signup", async (req, res) => {
  //creating a new instance of a the UserModel
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User info added succesfully");
  } catch (error) {
    res.status(400).send("Error saving the instance");
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

//update user LastName
app.patch("/user", async (req, res) => {
  try {
    const usersList = await User.updateOne({
      firstName: "Nandakishor",
      lastName: "A.S",
    });
    res.send(usersList);
  } catch (error) {
    res.status(400).send("Error fetching the user info" + error);
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
