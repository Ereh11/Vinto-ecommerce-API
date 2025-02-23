const { Category } = require("../models/category.modle.js");
const sendResponse = require("../utils/sendResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const { status } = require("../utils/status.js");

// GET all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (categories.length === 0) {
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
    { categories },
    "Categories retrieved successfully"
  );
});

// GET by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { category: null },
      "Category not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category retrieved successfully"
  );
});

// POST
exports.createCategory = asyncHandler(async (req, res) => {
  const { title, img } = req.body;
  const category = new Category({ title, img });
  await category.save();

  sendResponse(
    res,
    status.Success,
    201,
    { category },
    "Category created successfully"
  );
});

// PUT
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { category: null },
      "Category not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category updated successfully"
  );
});

// PATCH
exports.partialUpdateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { category: null },
      "Category not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category partially updated successfully"
  );
});

// DELETE by ID
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { category: null },
      "Category not found"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category deleted successfully"
  );
});

// DELETE all
exports.deleteAllCategories = asyncHandler(async (req, res) => {
  const result = await Category.deleteMany({});
  if (result.deletedCount === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { categories: null },
      "No categories found to delete"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { categories: [] },
    "All categories deleted successfully"
  );
});
