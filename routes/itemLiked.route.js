const express = require("express");
const router = express.Router();
const likeController = require("../controllers/itemLiked.controller.js");
const validateIds = require("../middlewares/validateIds");

//get all (Admin)
router.get("/", likeController.getAllLikedItems);

//get by user ID
router.get("/:userId", validateIds, likeController.getLikedItemsByUserId);

//post
router.post("/", validateIds, likeController.likeItem);

//delete
router.delete("/:userId/:productId", validateIds, likeController.unlikeItem);

//delete all liked items (Admin)
router.delete("/", likeController.deleteAllLikedItems);

module.exports = router;
