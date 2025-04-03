const { ItemOrdered } = require("../models/itemOrdered.modle");
const sendResponse = require("../utils/sendResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const status = require("../utils/status");

// Post
const createItemOrdered = asyncHandler(async (req, res) => {
  const { product, user, quantity } = req.body;
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

// Get All Items Ordered
const getAllItemOrdered = asyncHandler(async (req, res) => {
  const itemsOrdered = await ItemOrdered.find();
  if (itemsOrdered.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { categories: null },
      "No categories found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemsOrdered },
    "All Item Ordered fetched successfully"
  );
});
// Get by ID
const getItemOrderedById = asyncHandler(async (req, res) => {
  const itemOrdered = await ItemOrdered.findById(req.params.id);
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
    "Item Ordered fetched successfully"
  );
});
// Delete All Items Ordered
const deleteAllItemOrdered = asyncHandler(async (req, res) => {
  const deleted = await ItemOrdered.deleteMany();
  if (deleted.deletedCount === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { itemOrdered: null },
      "No Item Ordered found"
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
// Delete by ID
const deleteItemOrderedById = asyncHandler(async (req, res) => {
  const itemOrdered = await ItemOrdered.findByIdAndDelete(req.params.id);

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
    "Item Ordered deleted successfully"
  );
});
// PUT
const updateItemOrderedById = asyncHandler(async (req, res) => {
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
// Patch
const updatePartialyItemOrderedById = asyncHandler(async (req, res) => {
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
      "Item not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { itemOrdered },
    "Item updated successfully"
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
