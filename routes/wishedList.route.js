const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controllers.js");
const validateObjectId = require("../middlewares/validateObjectId.js");


router.route("/:userId")
  .get(validateObjectId("userId"), wishlistController.getWishlistByUserId) // Get wishlist by user ID
  .delete(validateObjectId("userId"), wishlistController.clearWishlist); // Clear the whole wishlist
router.route("/")
  .post(wishlistController.addToWishlist) // Add to wishlist
  .delete(wishlistController.removeItemFromWishlist); // Remove from wishlist

module.exports = router;
