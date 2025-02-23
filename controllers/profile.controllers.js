// Controllers for profile
const Profile = require("../models/profile.modle");
const User = require("../models/user.modle");

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate(
      "user",
      "-password"
    );

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found for this user",
      });
    }

    res.status(200).json({
      status: "success",
      data: profile,
      message: "Profile found",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const createProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await Profile.create({
      ...req.body,
      user: userId,
    });

    await profile.populate("user", "-password");

    res.status(201).json({
      status: "success",
      data: profile,
      message: "Profile created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found for this user",
      });
    }

    res.status(200).json({
      status: "success",
      data: profile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    const userId = profile.user;

    await Promise.all([
      Profile.findByIdAndDelete(profile._id),
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({
      status: "success",
      message: "Profile and user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile, createProfile };
