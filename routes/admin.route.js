const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/roleAuth");
const {
  getAllUsers,
  deleteUser,
  // ... other admin controllers
} = require("../controllers/admin.controllers");

// Protect all admin routes
router.use(protect);
router.use(isAdmin); // Require admin role for all routes in this router

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
// ... other admin routes

module.exports = router;
