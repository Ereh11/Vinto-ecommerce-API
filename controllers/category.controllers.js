const { Category } = require("../models/category.modle.js");
const sendResponse = require("../utils/sendResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

// GET all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (categories.length === 0) {
    return sendResponse(
      res,
      "FAIL",
      404,
      { categories: null },
      { text: "No categories found" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { categories },
    { text: "Categories retrieved successfully" }
  );
});

// GET by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendResponse(
      res,
      "FAIL",
      404,
      { category: null },
      { text: "Category not found" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { category },
    { text: "Category retrieved successfully" }
  );
});

// POST
exports.createCategory = asyncHandler(async (req, res) => {
  const { title, img } = req.body;
  const category = new Category({ title, img });
  await category.save();

  sendResponse(
    res,
    "SUCCESS",
    201,
    { category },
    { text: "Category created successfully" }
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
      "FAIL",
      404,
      { category: null },
      { text: "Category not found" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { category },
    { text: "Category updated successfully" }
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
      "FAIL",
      404,
      { category: null },
      { text: "Category not found" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { category },
    { text: "Category partially updated successfully" }
  );
});

// DELETE by ID
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return sendResponse(
      res,
      "FAIL",
      404,
      { category: null },
      { text: "Category not found" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { category },
    { text: "Category deleted successfully" }
  );
});

// DELETE all
exports.deleteAllCategories = asyncHandler(async (req, res) => {
  const result = await Category.deleteMany({});
  if (result.deletedCount === 0) {
    return sendResponse(
      res,
      "FAIL",
      404,
      { categories: null },
      { text: "No categories found to delete" }
    );
  }

  sendResponse(
    res,
    "SUCCESS",
    200,
    { categories: [] },
    { text: "All categories deleted successfully" }
  );
});
