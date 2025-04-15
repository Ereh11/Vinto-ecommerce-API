const User = require("../models/user.modle");
const { WishedList } = require("../models/wishedList.modle.js");
const UserOTPVerification = require("../models/UserOTPverification");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      confirmPassword,
      role,
      verified: false,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 12);

    // Save OTP
    await UserOTPVerification.create({
      userId: newUser._id,
      otp: hashedOTP,
    });

    // Send OTP email
    await sendEmail({
      to: newUser.email,
      subject: "Email Verification",
      text: `Your verification code is: ${otp}\nValid for 5 minutes.`,
    });

    // Modified response to highlight the user ID
    res.status(201).json({
      status: "success",
      message:
        "Please verify your email. Check your inbox for the verification code.",
      data: {
        userId: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 2) Check if email is verified
    if (!user.verified) {
      return res.status(401).json({
        status: "error",
        message: "Please verify your email first",
        userId: user._id, // Send userId so they can request new verification code
      });
    }

    // 3) Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 4) If everything ok, send token
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.confirmPassword;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      token,
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const protectedRoute = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: "error",
          message: "Please login to get access",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      next();
    }
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token or expired",
    });
  }
};
const forgotPassword = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with this email address",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Update frontend URL to port 4200
    const resetURL = `http://localhost:4200/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetURL}\n\nThis link is valid for 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.`,
    });

    // Debug info (remove in production)
    console.log("Reset Token:", resetToken);
    console.log("Hashed Token in DB:", user.passwordResetToken);

    res.status(200).json({
      status: "success",
      message: "Reset link sent to email",
    });
  } catch (error) {
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    console.error("Email error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error sending email. Try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    // 1) Hash the token from params
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log("Received token:", req.params.token);
    console.log("Hashed received token:", hashedToken);

    // 2) Find user with this token and check if expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    console.log("Found user:", user ? "Yes" : "No");
    console.log("Current time:", Date.now());
    console.log("Token expiry:", user?.passwordResetExpires);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }

    // 3) Update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      token,
    });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id; // Get ID from URL params

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if old password is correct
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "New password and confirm password do not match",
      });
    }

    // Update password
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const userOTPVerification = await UserOTPVerification.findOne({
      userId,
    });

    if (!userOTPVerification) {
      return res.status(400).json({
        status: "error",
        message: "Code has expired. Please request a new one.",
      });
    }

    const isValid = await bcrypt.compare(otp, userOTPVerification.otp);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification code",
      });
    }
    const wishedList = new WishedList({
      user: userId,
      products: [],
    });
    await wishedList.save();
    // Update user verification status
    await User.updateOne({ _id: userId }, { verified: true });
    await UserOTPVerification.deleteOne({ userId });

    // Generate token after verification
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const existingWishedList = await WishedList.findOne({ user: userId });
    if (existingWishedList) {
      await WishedList.deleteOne({ user: userId });
    }
    // When the user is verified, we create wishedList for the user
    await WishedList.create({
      user: userId,
      products: [],
    });
    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Add resend OTP function
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    // Delete any existing OTP
    await UserOTPVerification.deleteOne({ userId });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 12);

    // Save new OTP
    await UserOTPVerification.create({
      userId,
      otp: hashedOTP,
    });

    // Get user email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Send new OTP email
    await sendEmail({
      to: user.email,
      subject: "New Verification Code",
      text: `Your new verification code is: ${otp}\nValid for 5 minutes.`,
    });

    res.status(200).json({
      status: "success",
      message: "New verification code sent to email",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  protectedRoute,
  forgotPassword,
  resetPassword,
  updatePassword,
};
