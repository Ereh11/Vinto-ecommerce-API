const express = require("express");
const productcontroller = require('../controllers/product.controllers')
const validateProduct = require('../middlewares/validations/validateProduct')
const validateObjectId = require('../middlewares/validateObjectId')
const router = express.Router();

router.route('/')
  .get(productcontroller.getAllProducts)
  .post(validateProduct, productcontroller.postProduct)
  .delete(productcontroller.deleteproducts);

router.route('/newarrivals')
  .get(productcontroller.getNewArrivals);
router.route('/offers')
  .get(productcontroller.getOffers);
router.route('/toprated')
  .get(productcontroller.getTopRated);
router.route('/search')
  .get(productcontroller.searchProducts)
  .post(validateProduct, productcontroller.searchProducts);
router.route('/filter')
  .get(productcontroller.getFilteredProducts);

router.route('/:productId')
  .get(validateObjectId("productId"), productcontroller.getSingleProduct)
  .patch(validateObjectId("productId"), productcontroller.patchProduct)
  .put(validateObjectId("productId"), validateProduct, productcontroller.putProduct)
  .delete(validateObjectId("productId"), productcontroller.deleteProductById)



module.exports = router