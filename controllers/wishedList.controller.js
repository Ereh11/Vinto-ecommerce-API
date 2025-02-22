const asyncHandler = require("../middlewares/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { status } = require("../utils/status");
const { WishedList } = require("../models/wishedList.modle.js");

//dh ll admin
const getAllWishlists = asyncHandler(async (req, res) => {
  const wishlists = await WishedList.find()
    .populate("user")
    .populate("products");
  sendResponse(
    res,
    status.Success,
    200,
    { wishlists },
    "Fetched all wishlists successfully"
  );
});

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
      { wishlist: null },
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

const addToWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  await WishedList.updateOne(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true }
  );

  sendResponse(
    res,
    status.Success,
    200,
    { added: true },
    "Item added to wishlist"
  );
});

const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  await WishedList.updateOne(
    { user: userId },
    { $pull: { products: productId } }
  );

  sendResponse(
    res,
    status.Success,
    200,
    { removed: true },
    "Item removed from wishlist"
  );
});

const clearWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await WishedList.deleteOne({ user: userId });

  sendResponse(res, status.Success, 200, { cleared: true }, "Wishlist cleared");
});

module.exports = {
  getAllWishlists,
  getWishlistByUserId,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
