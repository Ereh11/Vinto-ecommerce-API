// Controllers for user routes
const mongoose = require("mongoose");
const User = require("../models/user.modle");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { __v: false, password: false });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     res.status(204).json({
//       status: "success",
//       data: null,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
// const deleteAllUsers = async (req, res) => {
//   try {
//     await User.deleteMany();
//     res.status(204).json({
//       status: "success",
//       data: null,
//       message: "All users deleted successfully",
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
};
