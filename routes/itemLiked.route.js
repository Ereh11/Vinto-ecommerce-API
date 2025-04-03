const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controllers");
const validateIds = require("../middlewares/validateIds");


//get all wishlists (Admin)
router.get("/", wishlistController.getAllWishlists);

//get wishlist by user ID
router.get("/:userId", validateIds, wishlistController.getWishlistByUserId);

//get single item
router.get(
  "/:userId/:productId",
  validateIds,
  wishlistController.getWishlistItem
);

router.route("/")
      .post(validateIds,
            wishlistController.addToWishlist)
      .get(validateIds,
            wishlistController.getAllWishlists)
      .delete(validateIds, wishlistController.removeItemFromWishlist);

router.route("/:userId")
      .post(validateIds,
            wishlistController.addToWishlist)
      .get(validateIds,
            wishlistController.getWishlistByUserId)
      .delete(validateIds,
            wishlistController.clearWishlist);

module.exports = router;