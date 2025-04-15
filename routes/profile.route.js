//profile routes
const express = require("express");
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controllers");
const { protect } = require("../middlewares/auth");

router.get("/:id", getProfile);
router.post("/:id", protect, createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

module.exports = router;
