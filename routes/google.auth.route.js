const express = require("express");
const router = express.Router();
const {
  googleSignup,
  googleSignupCallback,
  googleLogin,
  googleLoginCallback,
} = require("../controllers/google.auth");

// Google OAuth routes
router.get("/google/signup", googleSignup);
router.get("/google/signup/callback", googleSignupCallback);
router.get("/google/login", googleLogin);
router.get("/google/login/callback", googleLoginCallback);

module.exports = router;
