// login and register routes
const express = require("express");
const router = express.Router();
const { register, login } = require("../../controllers/authentications");
router.post("/register", register);
router.post("/login", login);

module.exports = router;
