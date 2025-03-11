const express = require("express");
const { check, validationResult } = require("express-validator");
const productcontroller = require('../controllers/product.controllers')
const validateschema = require('../middlewares/validateproduct')
const validateItemID = require("../middlewares/validateItemID");
const router = express.Router();
router.route('/')
  .get(productcontroller.getallproducts)
  .post(validateschema, productcontroller.postproducts)
  .delete(productcontroller.deleteproducts);

router.route('/newarrivals')
  .get(productcontroller.getNewArrivals);
router.route('/offers')
  .get(productcontroller.getOffers);
router.route('/toprated')
  .get(productcontroller.getTopRated);
router.route('/search')
  .get(productcontroller.searchProducts);
router.route('/filter')
  .get(productcontroller.getFilteredProducts);

router.route('/:productid')
  .get(productcontroller.getsingleproducts)
  .patch(productcontroller.patchproducts)
  .put(validateschema, productcontroller.putproducts)
  .delete(productcontroller.deleteproductsbyid)



module.exports = router