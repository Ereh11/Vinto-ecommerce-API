const asyncHandler = require("../middlewares/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");
const { status } = require("../utils/status.js");
const { ItemLiked } = require("../models/itemLiked.modle.js");
const { WishedList } = require("../models/wishedList.modle.js");

const toggleLike = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  const existingLike = await ItemLiked.findOne({
    user: userId,
    product: productId,
  });

  if (existingLike) {
    await ItemLiked.deleteOne({ _id: existingLike._id });

    await WishedList.updateOne(
      { user: userId },
      { $pull: { products: productId } }
    );

    return sendResponse(
      res,
      status.Success,
      200,
      { liked: false },
      "Item unLiked & removed from wishlist"
    );
  }

  await ItemLiked.create({ user: userId, product: productId });

  await WishedList.updateOne(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true }
  );

  return sendResponse(
    res,
    status.Success,
    200,
    { liked: true },
    "Item liked & added to wishlist"
  );
});

module.exports = { toggleLike };
