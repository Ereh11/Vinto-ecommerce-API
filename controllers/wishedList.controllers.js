const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const appError = require("../utils/appError.js");
const status = require("../utils/status.js");
const User = require("../models/user.modle.js");
const { WishedList } = require("../models/wishedList.modle.js");
const { Product } = require("../models/product.modle.js");
const { default: mongoose } = require("mongoose");

// ----------------- Get Wishlist by User ID -----------------
const getWishlistByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const wishlist = await WishedList.findOne({ user: userId }).populate(
    "products"
  );
  if (!wishlist) {
    throw new appError("No wishlist found for this user", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { wishlist },
    "Fetched user's wishlist successfully"
  );
});
// ----------------- Add Item to Wishlist -----------------
const addToWishlist = asyncHandler(async (req, res) => {
  const { user, products } = req.body;

  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    throw new appError("Invalid or missing user ID", 400, status.Fail);
  }

  const existingUser = await User.findById(user);
  if (!existingUser) {
    throw new appError("User not found", 404, status.Fail);
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new appError("No product IDs provided", 400, status.Fail);
  }

  const invalidProductIds = products.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidProductIds.length > 0) {
    throw new appError(
      "One or more product IDs are invalid",
      400,
      status.Fail,
      { invalidProductIds }
    );
  }

  const foundProducts = await Product.find({ _id: { $in: products } });
  if (foundProducts.length !== products.length) {
    const foundIds = foundProducts.map((p) => p._id.toString());
    const missing = products.filter((p) => !foundIds.includes(p.toString()));
    throw new appError("Some products were not found", 404, status.Fail, {
      missingProductIds: missing,
    });
  }

  const wishlist = await WishedList.findOne({ user });

  if (!wishlist) {
    wishlist = await WishedList.create({ user, products });
  } else {
    const uniqueProducts = products.filter(
      (productId) =>
        !wishlist.products.some((p) => p.toString() === productId.toString())
    );

    if (uniqueProducts.length > 0) {
      wishlist.products.push(...uniqueProducts);
      await wishlist.save();
    }
  }

  const populatedWishlist = await WishedList.findById(wishlist._id).populate(
    "products"
  );

  return sendResponse(
    res,
    status.Success,
    201,
    { wishlist: populatedWishlist },
    "Item(s) added to wishlist successfully"
  );
});
// ----------------- Remove Item from Wishlist -----------------
const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { user, products } = req.body;

  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    throw new appError("Invalid or missing user ID", 400, status.Fail);
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new appError("No product IDs provided", 400, status.Fail);
  }

  const invalidIds = products.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidIds.length > 0) {
    throw new appError("Invalid product ID format", 400, status.Fail, {
      invalidIds,
    });
  }

  const wishlist = await WishedList.findOne({ user });
  if (!wishlist) {
    throw new appError("No wishlist found for this user", 404, status.Fail);
  }

  const productsToRemove = products.filter((productId) =>
    wishlist.products.map((p) => p.toString()).includes(productId.toString())
  );

  if (productsToRemove.length === 0) {
    throw new appError(
      "No matching products found in the wishlist",
      400,
      status.Fail
    );
  }

  wishlist.products = wishlist.products.filter(
    (productId) => !productsToRemove.includes(productId.toString())
  );

  await wishlist.save();

  return sendResponse(
    res,
    status.Success,
    200,
    { removed: true, productsRemoved: productsToRemove },
    "Item(s) removed from wishlist successfully"
  );
});
// ----------------- Clear Wishlist -----------------
const clearWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const wishlist = await WishedList.findOne({ user: userId });

  if (!wishlist) {
    throw new appError("No wishlist found for this user", 404, status.Fail);
  }

  wishlist.products = [];
  await wishlist.save();

  return sendResponse(
    res,
    status.Success,
    200,
    { cleared: true },
    "Wishlist cleared successfully"
  );
});

module.exports = {
  getWishlistByUserId,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
