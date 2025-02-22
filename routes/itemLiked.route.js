const express = require("express");
const router = express.Router();
const likeController = require("../controllers/itemLiked.controller.js");
const validateIds = require("../middlewares/validateIds");

router.post("/toggle", validateIds, likeController.toggleLike);

module.exports = router;
