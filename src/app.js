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
const {userAuth} = require('./middlewares/auth')

app.use(express.json());
app.use(cookieParser());

//get profile of the user
app.get("/profile",userAuth,async (req, res) => {
  try {
    res.send(req.currentUser);
  } catch (error) { 
    res.send("Error: " + error.message);
  }
});

//send connection request

app.post("sendConnectionRequest",userAuth,(req,res)=>{
  const currentUser = req.currentUser
  res.send(currentUser.firstName+"sent a connection request");
})

//user signup
app.post("/signup", async (req, res) => {
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

//login a user
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });
  try {
    //checks if email is valid
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      //checks if password is valid
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        //creates a token
        const token = jwt.sign({ _id: user._id }, "Nandakishor@Earth$1029");
        res.cookie("token", token);
        res.send("Login Success");
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (error) {
    res.send("Error: " + error.message);
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
