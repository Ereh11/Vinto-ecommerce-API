const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Cart } = require('../models/cart.modle.js');


const checkoutSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) throw new Error('Missing session ID');

    // Retrieve session with expanded data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    });


    if (!session.client_reference_id) {
      throw new Error('Client reference ID missing in Stripe session');
    }

    // Update cart using atomic operation
    const result = await Cart.updateOne(
      { _id: session.client_reference_id },
      {
        $set: {
          status: 'inprogress',
          stripeSessionId: session.id,
          paymentStatus: session.payment_status
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Cart not found for client reference ID');
    }

    res.redirect('http://localhost:4200/');

  } catch (error) {
    res.redirect(`http://localhost:4200/checkout-error?message=${encodeURIComponent(error.message)}`);
  }
};



const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.params.id,
      status: 'pending'
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Explicitly set client_reference_id
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Order Payment',
            description: 'Payment for your order'
          },
          unit_amount: Math.round((cart.total + 1000) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:4000/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:4200/checkout-canceled',
      client_reference_id: cart._id.toString(), // Explicit conversion
      expand: ['payment_intent']
    });

    res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCheckoutSession, checkoutSuccess };



