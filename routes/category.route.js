const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers.js");
const validateCategory = require("../middlewares/validateCategory");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(validateCategory, categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(validateCategory, categoryController.updateCategory)
  .patch(categoryController.partialUpdateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
