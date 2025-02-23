const { Cart } = require('../models/cart.modle.js');
const { ItemOrdered } = require('../models/itemOrdered.modle.js');
const { Product } = require('../models/product.modle.js');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { status } = require('../utils/status');





exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find();

  if (cart.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cart: null },
      "No Cart found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart },
    "Cart retrieved successfully"
  );

});

exports.getAllCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (cart.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cart: null },
      "No Cart found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart },
    "Cart retrieved successfully"
  );

});

exports.createCart = asyncHandler(async (req, res) => {
  const { ItemsOrdered } = req.body;

  const cartInstance = new Cart({ ItemsOrdered });
  await cartInstance.save();

  const populatedCart = await Cart.findById(cartInstance._id)
    .populate({
      path: 'ItemsOrdered',
      populate: {
        path: 'product'
      }
    });

  let total = populatedCart.ItemsOrdered.reduce((sum, item) => {
    if (item.product && item.product.price) {
      if (item.product.discount) {
        return sum + (item.product.discount * item.quantity);
      }
      return sum + (item.product.price * item.quantity);
    }
    return sum;
  }, 0);

  populatedCart.total = total;
  await populatedCart.save();

  sendResponse(
    res,
    status.Success,
    201,
    { cartInstance: populatedCart },
    'Cart created successfully'
  );
});


exports.updateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cart) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cart: null },
      "cart not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart },
    "cart updated successfully"
  );
});

exports.partialUpdateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cart) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cart: null },
      "cart not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart },
    "cart partially updated successfully"
  );
});

exports.deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  if (!cart) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cart: null },
      "cart not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart },
    "cart deleted successfully"
  );
});

exports.deleteAllCarts = asyncHandler(async (req, res) => {
  const result = await Cart.deleteMany({});
  if (result.deleteCart === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { carts: null },
      "No carts found to delete"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { carts: [] },
    "All carts deleted successfully"
  );
});
