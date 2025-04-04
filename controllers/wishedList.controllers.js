const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const appError = require("../utils/appError.js");
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

  // Validate that products is an array and contains valid product IDs
  if (!Array.isArray(products) || products.length === 0) {
    throw new appError("No product IDs provided", 400, status.Fail);
  }

  if (products.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new appError("Invalid product ID format", 400, status.Fail);
  }

  // Find wishlist for the user
  const wishlist = await WishedList.findOne({ user });
  if (!wishlist) {
    throw new appError("No wishlist found for this user", 404, status.Fail);
  }

  // Filter out the product IDs to be removed
  const productsToRemove = products.filter((productId) =>
    wishlist.products.includes(productId.toString()) // Ensure consistent comparison with strings
  );

  // If no matching products are found
  if (productsToRemove.length === 0) {
    throw new appError("No matching products found in the wishlist", 400, status.Fail);
  }

  // Remove the matched products from the wishlist
  wishlist.products = wishlist.products.filter(
    (productId) => !productsToRemove.includes(productId.toString()) // Ensure same type comparison
  );

  // Save the updated wishlist
  await wishlist.save();

  // Send success response
  sendResponse(
    res,
    status.Success,
    200,
    { removed: true },
    "Item(s) removed from wishlist successfully"
  );
});

// ----------------- Clear Wishlist -----------------
const clearWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const wishlist = await WishedList.findOne({ user: userId });
  if (!wishlist) {
    throw new appError(
      "No wishlist found for this user",
      404,
      status.Fail,
      null
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
