// Controllers for profile
const Profile = require("../models/profile.modle");
const User = require("../models/user.modle");

const MAX_PHOTO_SIZE = process.env.MAX_PHOTO_SIZE_MB * 1024 * 1024; // Convert MB to bytes

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
    // Check if photo was uploaded
    if (req.files && req.files.picture) {
      const photo = req.files.picture;

      // Check file size
      if (photo.size > MAX_PHOTO_SIZE) {
        return res.status(400).json({
          status: "error",
          message: `Profile picture size must be less than ${process.env.MAX_PHOTO_SIZE_MB}MB`,
        });
      }
    }

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
    // Check if photo was uploaded
    if (req.files && req.files.picture) {
      const photo = req.files.picture;

      // Check file size
      if (photo.size > MAX_PHOTO_SIZE) {
        return res.status(400).json({
          status: "error",
          message: `Profile picture size must be less than ${process.env.MAX_PHOTO_SIZE_MB}MB`,
        });
      }
    }

    const updateData = { ...req.body };

    // Handle file upload if there is one
    if (req.file) {
      updateData.picture = req.file.path; // or however you're storing the image URL
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.params.id },
      updateData,
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
