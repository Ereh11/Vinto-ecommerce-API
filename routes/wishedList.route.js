const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controllers.js");
const validateIds = require("../middlewares/validateIds");
const validateObjectId = require("../middlewares/validateObjectId.js");
const checkUserIdProvided = require("../middlewares/checkUserIdProvided.js");



router.get("/:userId", validateIds, wishlistController.getWishlistByUserId);


router.route("/:userId")
  .get(wishlistController.getWishlistByUserId) // Get wishlist by user ID
  .delete(checkUserIdProvided, validateObjectId("userId"), wishlistController.clearWishlist); // Clear wishlist

router.route("/")
  .get(wishlistController.getAllWishlists) // Get all wishlists (Admin)
  .post(wishlistController.addToWishlist) // Add to wishlist
  .delete(wishlistController.removeItemFromWishlist) // Get wishlist by user ID



module.exports = router;
