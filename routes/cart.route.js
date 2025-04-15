const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controllers.js");
const validateCart = require("../middlewares/validateCart.js");
const validateItemID = require("../middlewares/validateItemID.js");


router.route("/")
  .post(validateCart, cartController.createCart)
  .get(cartController.getAllCart)
  .delete(cartController.deleteAllCarts)

router.route("/:id")
  .post(validateItemID, cartController.addToCart)
  .get(validateItemID, cartController.getMyCart)
  .put(validateItemID, cartController.updateCart)
  .patch(validateItemID, cartController.partialUpdateCart)
  .delete(validateItemID, cartController.deleteCart)

router.route("/remove/:id")
  .post(validateItemID, cartController.removeItemFromCart)

router.route("/admin/:id")
  .get(validateItemID, cartController.getCart)

router.route("/history/:id")
  .get(validateItemID, cartController.getAllUserCarts)
module.exports = router;



