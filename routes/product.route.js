const express = require("express");
const { check,validationResult } = require("express-validator");
const productcontroller= require('../controllers/product.controllers')

const router = express.Router();
router.get('/',productcontroller.getallproducts);


router.get('/:productid', productcontroller.getsingleproducts)



router.post(
  "/",
  [
    check("title", "Title is required").notEmpty(),
    check("price", "Price is required and must be a number").isNumeric(),
    check("describe", "Description is required").notEmpty(),
    check("rate", "Rate is required and must be a number").isNumeric(),
    check("discount", "Discount is required and must be a number").isNumeric(),
    check("quantity", "Quantity is required and must be a number").isNumeric(),
  ],productcontroller.postproducts
 
);

router.patch("/:productid",productcontroller.patchproducts)

router.put("/api/products/:productid", [
  check("title", "Title is required").notEmpty(),
  check("price", "Price is required and must be a number").isNumeric(),
  check("describe", "Description is required").notEmpty(),
  check("rate", "Rate is required and must be a number").isNumeric(),
  check("discount", "Discount is required and must be a number").isNumeric(),
  check("quantity", "Quantity is required and must be a number").isNumeric(),
],productcontroller.putproducts)
 
router.delete("/:productid" ,productcontroller.deleteproductsbyid )

module.exports= router