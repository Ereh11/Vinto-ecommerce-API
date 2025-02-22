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
  .get(validateItemID, cartController.getCart)
  .put(validateItemID, cartController.updateCart)
  .patch(validateItemID, cartController.partialUpdateCart)
  .delete(validateItemID, cartController.deleteCart)
module.exports = router;


