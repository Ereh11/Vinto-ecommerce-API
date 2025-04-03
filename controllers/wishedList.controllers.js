const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const  status  = require("../utils/status.js");
const { WishedList } = require("../models/wishedList.modle.js");

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

  const updatedWishlist = await WishedList.findOneAndUpdate(
    { user },
    { $addToSet: { products: { $each: products } } },
    { new: true, upsert: true }
  ).populate("products");

  sendResponse(
    res,
    status.Success,
    200,
    { wishlist: updatedWishlist },
    "Item added to wishlist"
  );
});

// ----------------- Remove Item from Wishlist -----------------
const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const result = await WishedList.updateOne(
    { user: userId },
    { $pull: { products: productId } }
  );

  if (result.modifiedCount === 0) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { removed: false },
      "Item not found in wishlist"
    );
  }

  const updatedWishlist = await WishedList.findOne({ user: userId });
  if (!updatedWishlist || updatedWishlist.products.length === 0) {
    await WishedList.deleteOne({ user: userId });
  }

  sendResponse(
    res,
    status.Success,
    200,
    { removed: true },
    "Item removed from wishlist"
  );
});

// ----------------- Clear Wishlist -----------------
const clearWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const wishlist = await WishedList.findOne({ user: userId });

  if (!wishlist) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { cleared: false },
      "No wishlist found to clear"
    );
  }

  await WishedList.deleteOne({ user: userId });
  sendResponse(res, status.Success, 200, { cleared: true }, "Wishlist cleared");
});

module.exports = {
  getAllWishlists,
  getWishlistByUserId,
  getWishlistItem,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
