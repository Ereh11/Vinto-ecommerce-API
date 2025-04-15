const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers.js");
const validateCategory = require("../middlewares/validations/validateCategory.js");
const validateObjectId = require("../middlewares/validateObjectId");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(validateCategory, categoryController.createCategory)
  .delete(categoryController.deleteAllCategories);

router
  .route("/:id")
  .get(validateObjectId("id"), categoryController.getCategoryById)
  .put(validateObjectId("id"), validateCategory, categoryController.updateCategory)
  .patch(validateObjectId("id"), validateCategory, categoryController.partialUpdateCategory)
  .delete(validateObjectId("id"), categoryController.deleteCategory);

module.exports = router;
