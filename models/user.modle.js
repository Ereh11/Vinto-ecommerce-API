const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "this field is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "this field is required"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "this field is required"],
    validate: [
      validator.isStrongPassword,
      "Please provide a strong password min 8 characters at least one uppercase, one lowercase, one number and one special character",
    ],
  },
  role: {
    type: String,
    required: [true, "this field is required"],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
