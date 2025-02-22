const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controller.js");
const validateIds = require("../middlewares/validateIds");

router.get("/", wishlistController.getAllWishlists);
router.get("/:userId", validateIds, wishlistController.getWishlistByUserId);
router.post("/", validateIds, wishlistController.addToWishlist);
router.delete("/item", validateIds, wishlistController.removeItemFromWishlist);
router.delete("/:userId", validateIds, wishlistController.clearWishlist);

module.exports = router;
