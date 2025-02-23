const User = require("../models/user.modle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password,
      confirmPassword,
      role,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.confirmPassword;

    res.status(201).json({
      status: "success",
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

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

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
const forgotPassword = async (req, res) => {};
const resetPassword = async (req, res) => {};

module.exports = {
  register,
  login,
  protectedRoute,
  forgotPassword,
  resetPassword,
};
