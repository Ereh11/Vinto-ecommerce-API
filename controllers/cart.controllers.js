const { Cart } = require("../models/cart.modle.js");
const { ItemOrdered } = require("../models/itemOrdered.modle.js");
const { Product } = require("../models/product.modle.js");
const mongoose = require("mongoose");
const sendResponse = require("../utils/sendResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const status = require("../utils/status.js");

getTotal = (quantity, price, discount = 0) => {
  return (price - (discount / 100) * price) * quantity;
};

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.params.id;
  let cart = await Cart.findOne({ user: userId, status: "pending" });

  if (cart) {
    // I have the cart
    const existingItemOrdered = await ItemOrdered.findOne({
      _id: { $in: cart.ItemsOrdered },
      product: productId,
      user: userId,
    });
    // I have the product
    if (existingItemOrdered) {
      existingItemOrdered.quantity += quantity;
      await existingItemOrdered.save();
      const product = await Product.findById(productId);
      product.quantity = product.quantity - quantity; // Removing the ordered quantity from the product quantity

      if (product) {
        if (product.discount) {
          cart.total += getTotal(quantity, product.price, product.discount);
        } else {
          cart.total += getTotal(quantity, product.price);
        }
      }

      await cart.save();
      return sendResponse(res, status.Success, 200, { cart });
    }
  } else {
    cart = new Cart({ user: userId, ItemsOrdered: [], total: 0 });
  }
  const itemOrdered = new ItemOrdered({
    product: productId,
    user: userId,
    quantity,
  });
  await itemOrdered.save();

  cart.ItemsOrdered.push(itemOrdered._id);

  const product = await Product.findById(productId);

  if (product) {
    if (product.discount) {
      cart.total += getTotal(quantity, product.price, product.discount);
    } else {
      cart.total += getTotal(quantity, product.price);
    }
  }

  await cart.save();
  sendResponse(res, status.Success, 200, { cart });
});

exports.getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.id, status: "pending" })
    .sort({ date: -1 })
    .populate({
      path: "ItemsOrdered",
      populate: {
        path: "product",
        model: "Product",
      },
    });

  const productsWithStatus = cart.ItemsOrdered.map(item => ({
    orderedItemId: item._id,
    product: item.product ? item.product : null,
    quantity: item.quantity,
    status: cart.status,
  }));

  if (!cart) {
    return sendResponse(res, status.Fail, 404, { cart: null }, "No Cart found");
  }

  const formattedResponse = {
    // cartId: cart._id,
    date: cart.date,
    total: cart.total,
    status: cart.status,
    items: productsWithStatus,
  };

  if (cart.length === 0) {
    return sendResponse(res, status.Fail, 404, { cart: null }, "No Cart found");
  }

  sendResponse(
    res,
    status.Success,
    200,
    { cart: formattedResponse },
    "Cart retrieved successfully"
  );
});

exports.getAllUserCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find({
    user: req.params.id,
    status: { $ne: "pending" },
  })
    .sort({ date: -1 })
    .populate({
      path: "ItemsOrdered",
      populate: {
        path: "product",
        model: "Product",
        select:
          "title price describe rate discount quantity img characteristics category",
      },
    });
  const formattedResponse = carts.map((cart) => {
    const productsWithStatus = cart.ItemsOrdered.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      status: cart.status,
    }));

    return {
      cartId: cart._id,
      date: cart.date,
      total: cart.total,
      status: cart.status,
      items: productsWithStatus,
    };
  });
  sendResponse(
    res,
    status.Success,
    200,
    {
      carts: formattedResponse,
    },
    "Carts retrieved successfully"
  );
});

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ _id: req.params.id });

  if (cart.length === 0) {
    return sendResponse(res, status.Fail, 404, { cart: null }, "No Cart found");
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
  const cart = await Cart.find();

  if (cart.length === 0) {
    return sendResponse(res, status.Fail, 404, { cart: null }, "No Cart found");
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
  const cart = await Cart.find();

  if (cart.length === 0) {
    return sendResponse(res, status.Fail, 404, { cart: null }, "No Cart found");
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
  const { ItemsOrdered, user } = req.body;
  const existingCart = await Cart.findOne({
    status: "pending",
  });

  let cartInstance;

  if (existingCart) {
    existingCart.ItemsOrdered.push(...ItemsOrdered);
    cartInstance = existingCart;
  } else {
    cartInstance = new Cart({ ItemsOrdered, user });
  }
  await cartInstance.save();

  const populatedCart = await Cart.findById(cartInstance._id).populate({
    path: "ItemsOrdered",
    populate: {
      path: "product",
    },
  });

  let total = populatedCart.ItemsOrdered.reduce((sum, item) => {
    if (item.product && item.product.price) {
      if (item.product.discount) {
        const priceAfterDiscount =
          item.product.price * (1 - item.product.discount / 100);
        return sum + priceAfterDiscount * item.quantity;
      }
      return sum + item.product.price * item.quantity;
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
    "Cart created successfully"
  );
});

exports.updateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cart) {
    return sendResponse(res, status.Fail, 404, { cart: null });
  }

  const populatedCart = await Cart.findById(cart._id).populate({
    path: "ItemsOrdered",
    populate: {
      path: "product",
    },
  });

  let total = populatedCart.ItemsOrdered.reduce((sum, item) => {
    if (item.product && item.product.price) {
      const priceAfterDiscount =
        item.product.price * (1 - item.product.discount / 100);
      return sum + priceAfterDiscount * item.quantity;
    }
    return sum;
  }, 0);

  populatedCart.total = total;
  await populatedCart.save();

  sendResponse(res, status.Success, 200, { cart });
});

exports.partialUpdateCart = asyncHandler(async (req, res) => {
  const { itemOrderedId, newQuantity } = req.body;
  const userId = req.params.id;

  const cart = await Cart.findOne({ user: userId, status: "pending" }).populate(
    {
      path: "ItemsOrdered",
      populate: {
        path: "product",
        select: "price discount quantity",
      },
    }
  );

  if (!cart) {
    return sendResponse(res, status.Fail, 404, { message: "Cart not found" });
  }

  const itemOrdered = cart.ItemsOrdered.find((item) =>
    item._id.equals(itemOrderedId)
  );

  if (!itemOrdered) {
    return sendResponse(res, status.Fail, 404, {
      message: "Item not found in cart",
    });
  }

  const quantityDelta = newQuantity - itemOrdered.quantity;
  const oldQuantity = itemOrdered.quantity;

  const product = await Product.findById(itemOrdered.product._id);
  if (!product) {
    return sendResponse(res, status.Fail, 404, {
      message: "Product not found",
    });
  }

  if (product.quantity < quantityDelta) {
    return sendResponse(res, status.Fail, 400, {
      message: `Only ${product.quantity} items available in stock`,
    });
  }

  product.quantity -= quantityDelta;
  itemOrdered.quantity = newQuantity;

  const pricePerItem = itemOrdered.product.discount
    ? itemOrdered.product.price * (1 - itemOrdered.product.discount / 100)
    : itemOrdered.product.price;

  const totalDelta = pricePerItem * quantityDelta;
  cart.total += totalDelta;

  await Promise.all([product.save(), itemOrdered.save(), cart.save()]);

  const productsWithStatus = updatedCart.ItemsOrdered.map(item => ({
    orderedItemId: item._id,
    product: item.product ? item.product : null,
    quantity: item.quantity,
    status: updatedCart.status,
  }));

  const formattedResponse = {
    _id: updatedCart._id,
    date: updatedCart.date,
    total: updatedCart.total,
    status: updatedCart.status,
    items: productsWithStatus
  };

  sendResponse(res, status.Success, 200, { cart: formattedResponse });

});

exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemOrderedId } = req.body;
  const userId = req.params.id;

  const cart = await Cart.findOne({ user: userId, status: "pending" }).populate(
    {
      path: "ItemsOrdered",
      match: { _id: itemOrderedId },
      populate: {
        path: "product",
        select: "price discount quantity",
      },
    }
  );

  if (!cart) {
    return sendResponse(res, status.Fail, 404, { message: "Cart not found" });
  }

  if (!cart.ItemsOrdered.length) {
    return sendResponse(res, status.Fail, 404, {
      message: "Item not found in cart",
    });
  }

  const itemToRemove = cart.ItemsOrdered.find((item) =>
    item._id.equals(itemOrderedId)
  );

  if (!itemToRemove) {
    return sendResponse(res, status.Fail, 404, {
      message: "Item not found in cart",
    });
  }

  const product = await Product.findById(itemToRemove.product._id);

  if (!product) {
    return sendResponse(res, status.Fail, 404, {
      message: "Product not found",
    });
  }

  await Product.findByIdAndUpdate(itemToRemove.product._id, {
    $inc: { quantity: itemToRemove.quantity },
  });

  const pricePerItem = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const itemTotal = pricePerItem * itemToRemove.quantity;
  cart.total -= itemTotal;
  cart.ItemsOrdered.pull(itemOrderedId);

  await ItemOrdered.findByIdAndDelete(itemOrderedId);
  await cart.save();

  sendResponse(res, status.Success, 200, null);
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

  sendResponse(res, status.Success, 200, { cart }, "cart deleted successfully");
});

exports.deleteAllCarts = asyncHandler(async (req, res) => {
  const result = await Cart.deleteMany({});
  if (result.deletedCount === 0) {
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
