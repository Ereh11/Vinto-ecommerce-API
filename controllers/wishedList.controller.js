const asyncHandler = require("../middlewares/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { status } = require("../utils/status");
const { WishedList } = require("../models/wishedList.modle.js");
const { ItemLiked } = require("../models/itemLiked.modle.js");

// ----------------- Get All Wishlists (Admin) -----------------
const getAllWishlists = asyncHandler(async (req, res) => {
  const wishlists = await WishedList.find({})
    .populate("user")
    .populate("products");

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
  const { userId, productId } = req.body;
  const existingWishlist = await WishedList.findOne({
    user: userId,
    products: productId,
  });

  if (existingWishlist) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { added: false },
      "Item already in wishlist"
    );
  }
  const updatedWishlist = await WishedList.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true, new: true }
  ).populate("products");

  await ItemLiked.findOneAndUpdate(
    { user: userId, product: productId },
    { user: userId, product: productId },
    { upsert: true }
  );

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

  await ItemLiked.deleteOne({ user: userId, product: productId });

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

  await ItemLiked.deleteMany({ user: userId });

  await WishedList.deleteOne({ user: userId });
  sendResponse(res, status.Success, 200, { cleared: true }, "Wishlist cleared");
});

// ----------------- Delete All Wishlists (Admin) -----------------
const deleteAllWishlists = asyncHandler(async (req, res) => {
  const existingWishlists = await WishedList.countDocuments({});

  if (existingWishlists === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { deleted: false },
      "No wishlists found to delete"
    );
  }

  await WishedList.deleteMany({});
  await ItemLiked.deleteMany({});
  sendResponse(
    res,
    status.Success,
    200,
    { deleted: true },
    "All wishlists deleted successfully"
  );
});

// ----------------- Update Wishlist (PUT) -----------------
const updateWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { products } = req.body;

  const uniqueProducts = [...new Set(products)];

  const updatedWishlist = await WishedList.findOneAndUpdate(
    { user: userId },
    { products: uniqueProducts },
    { new: true }
  ).populate("products");

  if (!updatedWishlist) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { updated: false },
      "No wishlist found for this user"
    );
  }

  await ItemLiked.deleteMany({ user: userId });
  const likedItems = uniqueProducts.map((product) => ({
    user: userId,
    product,
  }));
  await ItemLiked.insertMany(likedItems);

  sendResponse(
    res,
    status.Success,
    200,
    { wishlist: updatedWishlist },
    "Wishlist updated successfully"
  );
});

// ----------------- Partially Update Wishlist (PATCH) -----------------
const patchWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { productId, action } = req.body;

  let updateQuery;
  if (action === "add") {
    const existingWishlist = await WishedList.findOne({
      user: userId,
      products: productId,
    });

    if (existingWishlist) {
      return sendResponse(
        res,
        status.Fail,
        400,
        { added: false },
        "Item already in wishlist"
      );
    }
    updateQuery = { $addToSet: { products: productId } };
    likedAction = ItemLiked.findOneAndUpdate(
      { user: userId, product: productId },
      { user: userId, product: productId },
      { upsert: true }
    );
  } else if (action === "remove") {
    updateQuery = { $pull: { products: productId } };
    likedAction = ItemLiked.deleteOne({ user: userId, product: productId });
  } else {
    return sendResponse(
      res,
      status.Fail,
      400,
      { updated: false },
      "Invalid action. Use 'add' or 'remove'."
    );
  }

  const updatedWishlist = await WishedList.findOneAndUpdate(
    { user: userId },
    updateQuery,
    { new: true }
  ).populate("products");

  if (!updatedWishlist) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { updated: false },
      "No wishlist found for this user"
    );
  }

  await likedAction;

  sendResponse(
    res,
    status.Success,
    200,
    { wishlist: updatedWishlist },
    `Product ${action}ed successfully`
  );
});

module.exports = {
  getAllWishlists,
  getWishlistByUserId,
  getWishlistItem,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
  deleteAllWishlists,
  updateWishlist,
  patchWishlist,
};
