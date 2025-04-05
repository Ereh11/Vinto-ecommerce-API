const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const appError = require("../utils/appError.js");
const status = require("../utils/status.js");
const { WishedList } = require("../models/wishedList.modle.js");
const  User = require("../models/user.modle.js");
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

  // Find wishlist by userId and populate the products
  const wishlist = await WishedList.findOne({ user: userId }).populate("products");
  if (!wishlist) {
    throw new appError("No wishlist found for this user", 404, status.Fail);
  }

  // Return the wishlist successfully
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

  // Validate the user ID
  if (!user) {
    throw new appError("No user ID provided", 400, status.Fail);
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new appError("Invalid user ID format", 400, status.Fail);
  }
  const existUser = await User.findOne({ _id: user });
  if (!existUser) {
    throw new appError("User not found", 404, status.Fail);
  }


  if (!Array.isArray(products) || products.length === 0) {
    throw new appError("No product IDs provided", 400, status.Fail);
  }
  if (products.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new appError("Invalid product ID format", 400, status.Fail);
  }


  const existingWishlist = await WishedList.findOne({ user });

  if (!existingWishlist) {
    // If no wishlist exists, create a new one
    existingWishlist = await WishedList.create({ user, products });
  } else {
    // Check for products that are not already in the wishlist
    const productsToAdd = products.filter(
      (productId) => !existingWishlist.products.some((p) => p.toString() === productId.toString())
    );

    if (productsToAdd.length > 0) {
      // Add new products to the wishlist
      existingWishlist.products.push(...productsToAdd);
      await existingWishlist.save();
    }
  }
  return sendResponse(
    res,
    status.Success,
    200,
    { existingWishlist },
    "Item(s) added to wishlist successfully"
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
