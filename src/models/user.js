const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Weak password Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      validate(value) {
        if (value < 18) {
          throw new Error("You must be atleast 18 years old.");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error();
        }
      },
    },
    profileUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.veryicon.com%2Ficons%2Finternet--web%2Fprejudice%2Fuser-128.html&psig=AOvVaw2fWi2Esyi6J5c8eR8jtN3n&ust=1727446082637000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOjf06Lk4IgDFQAAAAAdAAAAABAE",
    },
    about: {
      type: String,
      minLength: 150,
      maxLength: 300,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Nandakishor@Earth$1029");
  return token;
};

UserSchema.methods.PasswordValidator = async function (userInputPassword) {
  const user = this;
  const isPasswordCorrect = await bcrypt.compare(userInputPassword,this.password);
  return isPasswordCorrect;
};

module.exports = mongoose.model("User", UserSchema);
