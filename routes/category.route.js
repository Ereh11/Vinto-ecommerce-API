const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers.js");
const validateCategory = require("../middlewares/validateCategory");
const validateCategoryID = require("../middlewares/validateCategoryID");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(validateCategory, categoryController.createCategory)
  .delete(categoryController.deleteAllCategories);

router
  .route("/:id")
  .get(validateCategoryID, categoryController.getCategoryById)
  .put(validateCategoryID, validateCategory, categoryController.updateCategory)
  .patch(validateCategoryID, categoryController.partialUpdateCategory)
  .delete(validateCategoryID, categoryController.deleteCategory);

module.exports = router;
