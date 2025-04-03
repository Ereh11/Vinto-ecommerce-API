const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const status = require("../utils/status.js");
const { ItemLiked } = require("../models/itemLiked.modle.js");
const { WishedList } = require("../models/wishedList.modle.js");

// ----------------- Get All Liked Items (Admin) -----------------
const getAllLikedItems = asyncHandler(async (req, res) => {
  const likedItems = await ItemLiked.find({})
    .populate("user")
    .populate("product");
  if (!likedItems.length) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { likedItems: [] },
      "No liked items found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { likedItems },
    "Fetched all liked items successfully"
  );
});

// ----------------- Get Liked Items by User ID -----------------
const getLikedItemsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const likedItems = await ItemLiked.find({ user: userId }).populate("product");

  if (!likedItems.length) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { likedItems: [] },
      "No liked items found for this user"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { likedItems },
    "Fetched user's liked items successfully"
  );
});

// ----------------- Add Item to Liked & Wishlist -----------------
const likeItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  // Check if the item is already liked
  const existingLike = await ItemLiked.findOne({
    user: userId,
    product: productId,
  });
  if (existingLike) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { liked: false },
      "Item is already liked"
    );
  }

  await ItemLiked.create({ user: userId, product: productId });

  const updatedWishlist = await WishedList.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true, new: true }
  );

  sendResponse(
    res,
    status.Success,
    200,
    { liked: true, wishlist: updatedWishlist },
    "Item liked & added to wishlist successfully"
  );
});

// ----------------- Remove Item from Liked & Wishlist -----------------
const unlikeItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  //check hya unliked wla la
  const deletedLike = await ItemLiked.findOneAndDelete({
    user: userId,
    product: productId,
  });
  if (!deletedLike) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { liked: false },
      "Item was not liked"
    );
  }

  const result = await WishedList.updateOne(
    { user: userId },
    { $pull: { products: productId } }
  );

  const updatedWishlist = await WishedList.findOne({ user: userId });
  if (!updatedWishlist || updatedWishlist.products.length === 0) {
    await WishedList.deleteOne({ user: userId });
  }

  sendResponse(
    res,
    status.Success,
    200,
    { liked: false },
    "Item unliked & removed from wishlist successfully"
  );
});

// ----------------- Delete All Liked Items (Admin) -----------------
const deleteAllLikedItems = asyncHandler(async (req, res) => {
  const existingItems = await ItemLiked.countDocuments({});

  if (existingItems === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      {},
      "No liked items found to delete"
    );
  }

  await ItemLiked.deleteMany({});
  await WishedList.deleteMany({});

  sendResponse(
    res,
    status.Success,
    200,
    {},
    "All liked items deleted successfully"
  );
});

module.exports = {
  getAllLikedItems,
  getLikedItemsByUserId,
  likeItem,
  unlikeItem,
  deleteAllLikedItems,
};