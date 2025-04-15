const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Cart } = require('../models/cart.modle.js');
const { ShipmentOrder } = require('../models/shipmentOrder.modle.js');
const { ShipmentInfo } = require('../models/shipmentInfo.modle.js');


const checkoutSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) throw new Error('Missing session ID');

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    });

    if (!session.client_reference_id) throw new Error('Client reference ID missing');

    const cartId = session.client_reference_id;
    const result = await Cart.updateOne(
      { _id: cartId },
      {
        $set: {
          status: 'inprogress',
          stripeSessionId: session.id,
          paymentStatus: session.payment_status,
          date: new Date()
        }
      }
    );
    if (!result.modifiedCount) throw new Error('Cart update failed');

    const cart = await Cart.findById(cartId); // Fetch the cart to get user ID
    if (!cart) throw new Error('Cart not found');

    // Retrieve and parse shipmentData from metadata
    const shipmentData = JSON.parse(session.metadata.shipmentData);
    console.log("Shipment Data:", shipmentData);

    console.log("test2")
    const shipmentInfo = new ShipmentInfo({
      user: cart.user._id,
      city: shipmentData.city,
      state: shipmentData.state,
      street: shipmentData.street,
      zipCode: shipmentData.zipCode,
      phones: [shipmentData.phone].concat(
        shipmentData.phone2 ? [shipmentData.phone2] : []
      )
    });
    await shipmentInfo.save();
    const shipmentOrder = new ShipmentOrder({
      cart: cartId,
      shipmentInfo: shipmentInfo._id,
      stripeSessionId: sessionId
    });
    await shipmentOrder.save();

    console.log("test6")
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
      expand: ['payment_intent'],
      metadata: {
        shipmentData: JSON.stringify(req.body.shipmentData)
      }
    });

    res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { userId, cartId } = req.body;
    const shipmentOrder = await ShipmentOrder.findOne({ cart: cartId })
      .populate('cart')
      .exec();
    const sessionId = shipmentOrder.stripeSessionId;


    const cart = await Cart.findOne({ _id: cartId, user: userId });
    if (!cart) throw new Error('Cart not found or unauthorized');
    if (cart.status !== 'inprogress') {
      throw new Error('Order cannot be canceled');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }
    const refund = await stripe.refunds.create({
      payment_intent: session.payment_intent.id
    });
    const updateResult = await Cart.updateOne(
      { _id: cartId },
      {
        $set: {
          status: 'canceled',
        }
      }
    );
    if (!updateResult.modifiedCount) throw new Error('Cart update failed');

    if (shipmentOrder) {
      await ShipmentOrder.findOneAndDelete({ cart: cartId });
    } else {
      console.warn(`No shipment order found for cart ${cartId}`);
    }

    res.status(200).json({
      success: true,
      refundId: refund.id
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


module.exports = { createCheckoutSession, checkoutSuccess, cancelOrder };



