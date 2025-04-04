const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const status = require("../utils/status.js");
const { WishedList } = require("../models/wishedList.modle.js");
const { default: mongoose } = require("mongoose");

// ----------------- Get All Wishlists (Admin) -----------------
const getAllWishlists = asyncHandler(async (req, res) => {
  const wishlists = await WishedList.find().populate("products");
  if (!wishlists.length) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { wishlists: [] },
      "No wishlists found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { wishlists },
    "Fetched all wishlists successfully"
  );
});

// ----------------- Get Wishlist by User ID -----------------
const getWishlistByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const wishlist = await WishedList.findOne({ user: userId }).populate(
    "products"
  );

  if (!wishlist) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { wishlist: [] },
      "No wishlist found for this user"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { wishlist },
    "Fetched user's wishlist successfully"
  );
});

// ----------------- Get Single Wishlist Item -----------------
const getWishlistItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const wishlist = await WishedList.findOne({
    user: userId,
    products: productId,
  }).populate({
    path: "products",
    match: { _id: productId },
  });

  if (!wishlist || !wishlist.products.length) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { wished: null },
      "Item not found in wishlist"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { product: wishlist.products[0] },
    "Wishlist item fetched successfully"
  );
});

// ----------------- Add Item to Wishlist -----------------
const addToWishlist = asyncHandler(async (req, res) => {
  const { user, products } = req.body;

  if (!user) {
    return sendResponse(res, status.Fail, 400, { added: false }, "No user ID provided");
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return sendResponse(res, status.Fail, 400, { added: false }, "Invalid user ID format");
  }
  if (!products || !Array.isArray(products) || products.length === 0) {
    return sendResponse(res, status.Fail, 400, { added: false }, "No product IDs provided");
  }
  if (products.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return sendResponse(res, status.Fail, 400, { added: false }, "Invalid product ID format");
  }

  let existingWishlist = await WishedList.findOne({ user: user });

  if (!existingWishlist) {
    existingWishlist = await WishedList.create({ user: user, products: products });
  } else {
    const productsToAdd = products.filter(
      (productId) => !existingWishlist.products.some((p) => p.toString() === productId.toString())
    );

    if (productsToAdd.length > 0) {
      existingWishlist.products.push(...productsToAdd);
      await existingWishlist.save();
    }
  }

  return sendResponse(
    res,
    status.Success,
    200,
    { added: true },
    "Item(s) added to wishlist"
  );
});


// ----------------- Remove Item from Wishlist -----------------
const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { user, products } = req.body;
  if (!user) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { removed: false },
      "No user ID provided"
    );
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { removed: false },
      "Invalid user ID format"
    );
  }
  if (!products || !Array.isArray(products) || products.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { removed: false },
      "No product IDs provided"
    );
  }
  if (products.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { removed: false },
      "Invalid product ID format"
    );
  }
  const wishlist = await WishedList.findOne({ user: user });
  if (!wishlist) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { removed: false },
      "No wishlist found for this user"
    );
  } else {
    const productsToRemove = products.filter((productId) =>
      wishlist.products.includes(productId)
    );
    if (productsToRemove.length === 0) {
      return sendResponse(
        res,
        status.Fail,
        400,
        { removed: false },
        "No matching products found in the wishlist"
      );
    } else {
      const productsToRemove = products.filter((productId) =>
        wishlist.products.includes(productId.toString()) // Ensure the same data type
      );
      
      if (productsToRemove.length === 0) {
        return sendResponse(
          res,
          status.Fail,
          400,
          { removed: false },
          "No matching products found in the wishlist"
        );
      } else {
        // Ensure product IDs are compared correctly
        wishlist.products = wishlist.products.filter(
          (productId) => !productsToRemove.includes(productId.toString()) // Ensure same type comparison
        );
      
        await wishlist.save();
        sendResponse(
          res,
          status.Success,
          200,
          { removed: true },
          "Item removed from wishlist successfully"
        );
      }
    }
  }
});

// ----------------- Clear Wishlist -----------------
const clearWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { cleared: false },
      "No user ID provided"
    );
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { cleared: false },
      "Invalid user ID format"
    );
  }
  const wishlist = await WishedList.findOne({ user: userId });
  if (!wishlist) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { cleared: false },
      "No wishlist found for this user"
    );
  } else {
    wishlist.products = [];
    await wishlist.save();
    sendResponse(
      res,
      status.Success,
      200,
      { cleared: true },
      "Wishlist cleared successfully"
    );
  }
});

module.exports = {
  getAllWishlists,
  getWishlistByUserId,
  getWishlistItem,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
