const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controller.js");
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

//post single item
router.post("/", wishlistController.addToWishlist);

//put
router.put("/:userId", validateIds, wishlistController.updateWishlist);

//patch
router.patch("/:userId", validateIds, wishlistController.patchWishlist);

//delete single item
router.delete(
  "/:userId/:productId",
  validateIds,
  wishlistController.removeItemFromWishlist
);

//delete all wishlist
router.delete("/:userId", validateIds, wishlistController.clearWishlist);

//delete all wishlists (Admin)
router.delete("/", wishlistController.deleteAllWishlists);

module.exports = router;
