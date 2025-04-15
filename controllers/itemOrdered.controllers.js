const sendResponse = require("../utils/sendResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const status = require("../utils/status");
const appError = require("../utils/appError");
const User = require("../models/user.modle");
const { ItemOrdered } = require("../models/itemOrdered.modle");
const { Product } = require("../models/product.modle");

// ----------------- POST -----------------
const createItemOrdered = asyncHandler(async (req, res) => {
  const { product, user, quantity } = req.body;
  const existingUser = await User.findById(user);
  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    throw new appError("Product not found", 404, status.Fail);
  }
  if (!existingUser) {
    throw new appError("User not found", 404, status.Fail);
  }
  const itemOrderedInstance = new ItemOrdered({ product, user, quantity });
  await itemOrderedInstance.save();
  sendResponse(
    res,
    status.Success,
    201,
    { itemOrderedInstance },
    "Item Ordered created successfully"
  );
});

// ----------------- GET ALL ITEMS ORDERED -----------------
const getAllItemOrdered = asyncHandler(async (req, res) => {
  const itemsOrdered = await ItemOrdered.find();
  if (itemsOrdered.length === 0) {
    throw new appError("No Item Ordered found", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemsOrdered },
    "All Item Ordered fetched successfully"
  );
});
// ----------------- GET ITEM ORDERED BY ID -----------------
const getItemOrderedById = asyncHandler(async (req, res) => {
  const itemOrdered = await ItemOrdered.findById(req.params.id);
  if (!itemOrdered) {
    throw new appError("Item Ordered not found", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemOrdered },
    "Item Ordered fetched successfully"
  );
});
// ----------------- DELETE ALL -----------------
const deleteAllItemOrdered = asyncHandler(async (req, res) => {
  const deleted = await ItemOrdered.deleteMany();
  if (deleted.deletedCount === 0) {
    throw new appError(
      "No Item Ordered found to delete",
      404,
      status.Fail
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    null,
    "All Item Ordered deleted successfully"
  );
});
// ----------------- DELETE ITEM ORDERED BY ID -----------------
const deleteItemOrderedById = asyncHandler(async (req, res) => {
  const itemOrdered = await ItemOrdered.findByIdAndDelete(req.params.id);

  if (!itemOrdered) {
    throw new appError("Item Ordered not found", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemOrdered },
    "Item Ordered deleted successfully"
  );
});
// ----------------- UPDATE ITEM ORDERED BY ID -----------------
const updateItemOrderedById = asyncHandler(async (req, res) => {
  const { product, user, quantity } = req.body;
  
  const existingUser = await User.findById(user);
  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    throw new appError("Product not found", 404, status.Fail);
  }
  if (!existingUser) {
    throw new appError("User not found", 404, status.Fail);
  }
  const itemOrdered = await ItemOrdered.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!itemOrdered) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { itemOrdered: null },
      "Item Ordered not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemOrdered },
    "Item Ordered updated successfully"
  );
});
// ----------------- UPDATE PARTIALLY ITEM ORDERED BY ID -----------------
const updatePartialyItemOrderedById = asyncHandler(async (req, res) => {
  const itemOrdered = await ItemOrdered.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!itemOrdered) {
    throw new appError("Item Ordered not found", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemOrdered },
    "Item Ordered updated successfully"
  );
});

module.exports = {
  createItemOrdered,
  getAllItemOrdered,
  getItemOrderedById,
  deleteAllItemOrdered,
  deleteItemOrderedById,
  updateItemOrderedById,
  updatePartialyItemOrderedById,
};
