const sendResponse = require("../utils/sendResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const status = require("../utils/status.js");
const appError = require("../utils/appError.js");
const { Category } = require("../models/category.modle.js");


// ----------------- GET all categories -----------------
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return sendResponse(
    res,
    status.Success,
    200,
    { categories },
    "Categories retrieved successfully"
  );
});
// ----------------- GET by ID -----------------
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    throw new appError("Category not found", 404, status.Fail, { category: null });
  }
  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category retrieved successfully"
  );
});
// ----------------- POST -----------------
const createCategory = asyncHandler(async (req, res) => {
  const { title, img } = req.body;
  const existingCategory = await Category.findOne({ title: title.trim() });
  if (existingCategory) {
    throw new appError("Category title already exists", 409, status.Fail);
  }

  const category = new Category({ title: title.trim(), img });
  await category.save();

  return sendResponse(
    res,
    status.Success,
    201,
    { category },
    "Category created successfully"
  );
});
// ----------------- PUT -----------------
const updateCategory = asyncHandler(async (req, res) => {
  
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new appError("Category not found", 404, status.Fail);
  }
  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category updated successfully"
  );
});
// ----------------- PATCH -----------------
const partialUpdateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new appError("Category not found", 404, status.Fail);
  }

  sendResponse(
    res,
    status.Success,
    200,
    { category },
    "Category partially updated successfully"
  );
});
// ----------------- DELETE by ID -----------------
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new appError("Category not found", 404, status.Fail, { category: null });
  }
  sendResponse(
    res,
    status.Success,
    204,
    { category },
    "Category deleted successfully"
  );
});
// ----------------- DELETE all -----------------
const deleteAllCategories = asyncHandler(async (req, res) => {
  const result = await Category.deleteMany({});

  if (result.deletedCount === 0) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { categories: null },
      "No categories found to delete"
    );
  }
  sendResponse(
    res,
    status.Success,
    204,
    { categories: [] },
    "All categories deleted successfully"
  );
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  partialUpdateCategory,
  deleteCategory,
  deleteAllCategories,
};