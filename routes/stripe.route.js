const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controllers.js');

router.post('/create-checkout-session/:id', stripeController.createCheckoutSession);
router.get('/success', stripeController.checkoutSuccess);
router.post('/cancel-order', stripeController.cancelOrder);

module.exports = router;



