const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controllers.js");
const validateIds = require("../middlewares/validateIds");



router.get("/:userId", validateIds, wishlistController.getWishlistByUserId);

router.delete("/:userId", validateIds, wishlistController.clearWishlist);



router.route("/")
  .get(wishlistController.getAllWishlists) // Get all wishlists (Admin)
  .post(wishlistController.addToWishlist) // Add to wishlist
  .delete(wishlistController.removeItemFromWishlist); // Remove from wishlist

router.route("/:userId")
  .get(wishlistController.getWishlistByUserId) // Get wishlist by user ID
  .delete(wishlistController.clearWishlist); // Clear wishlist

module.exports = router;
