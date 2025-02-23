//profile routes
const express = require("express");
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controllers");
const { updatePassword } = require("../controllers/authentications");

router.get("/:id", getProfile);
router.post("/:id", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);
router.patch("/:id/update-password", updatePassword);
module.exports = router;
