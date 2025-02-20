const { Category } = require("../models/category.modle.js");

const sendResponse = (res, status, code, data, message) => {
  res.status(code).json({ status, code, data, message });
};

//Get
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    sendResponse(
      res,
      "SUCCESS",
      200,
      categories,
      "Categories retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return sendResponse(res, "FAIL", 404, null, "Category not found");
    sendResponse(
      res,
      "SUCCESS",
      200,
      category,
      "Category retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

//Post
exports.createCategory = async (req, res, next) => {
  try {
    const { title, img } = req.body;
    const category = new Category({ title, img });
    await category.save();
    sendResponse(
      res,
      "SUCCESS",
      201,
      category,
      "Category created successfully"
    );
  } catch (error) {
    next(error);
  }
};

//put
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return sendResponse(res, "FAIL", 404, null, "Category not found");
    sendResponse(
      res,
      "SUCCESS",
      200,
      category,
      "Category updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

//patch
exports.partialUpdateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return sendResponse(res, "FAIL", 404, null, "Category not found");
    sendResponse(
      res,
      "SUCCESS",
      200,
      category,
      "Category partially updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

//Delete
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return sendResponse(res, "FAIL", 404, null, "Category not found");
    sendResponse(
      res,
      "SUCCESS",
      200,
      category,
      "Category deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};
