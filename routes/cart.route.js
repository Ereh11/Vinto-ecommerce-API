const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controllers.js");
const validateCart = require("../middlewares/validateCart.js");
const validateItemOrderedID = require("../middlewares/validateItemOrderedID.js");

router.route("/")
  .post(validateCart, cartController.createCart)
  .get(cartController.getAllCart)
  .delete(cartController.deleteAllCarts)

router.route("/:id")
  .get(cartController.getCart)
  .put(cartController.updateCart)
  .patch(cartController.partialUpdateCart)
  .delete(cartController.deleteCart)
module.exports = router;


