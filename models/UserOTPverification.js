const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

module.exports = UserOTPVerification;
