// all user routes are defined here except login and register
const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../controllers/authentications");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/user.controllers");

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
// router.delete("/", deleteAllUsers);

module.exports = router;
