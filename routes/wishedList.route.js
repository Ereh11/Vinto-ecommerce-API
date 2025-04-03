const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishedList.controllers.js");
const validateIds = require("../middlewares/validateIds");

router.get("/", wishlistController.getAllWishlists);
router.get("/:userId", validateIds, wishlistController.getWishlistByUserId);
router.get(
  "/:userId/:productId",
  validateIds,
  wishlistController.getWishlistItem
);
router.post("/", wishlistController.addToWishlist);
router.delete(
  "/:userId/:productId",
  validateIds,
  wishlistController.removeItemFromWishlist
);
router.delete("/:userId", validateIds, wishlistController.clearWishlist);

module.exports = router;
