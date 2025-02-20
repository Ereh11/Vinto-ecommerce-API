//profile routes
const express = require("express");
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profile.controllers");

router.get("/:id", getProfile);
router.post("/:id", createProfile);
router.put("/:id", updateProfile);

module.exports = router;
