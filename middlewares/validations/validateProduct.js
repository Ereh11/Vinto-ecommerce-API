const Joi = require("joi");
const appError = require("../../utils/appError");
const status = require("../../utils/status.js");
const { Category } = require("../../models/category.modle");

const productSchema = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    "string.empty": "Title is required",
  }),
  price: Joi.number().greater(0).required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
    "number.greater": "Price must be greater than 0",
  }),
  describe: Joi.string().trim().min(1).required().messages({
    "string.empty": "Description is required",
  }),
  rate: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rate must be a number",
    "any.required": "Rate is required",
    "number.min": "Rate must be between 1 and 5",
    "number.max": "Rate must be between 1 and 5",
  }),
  discount: Joi.number().min(0).max(100).required().messages({
    "number.base": "Discount must be a number",
    "any.required": "Discount is required",
    "number.min": "Discount must be between 0 and 100",
    "number.max": "Discount must be between 0 and 100",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "any.required": "Quantity is required",
    "number.min": "Quantity must be greater than or equal to 0",
  }),
  characteristics: Joi.array().items(Joi.string().trim()).optional(),
  img: Joi.array().items(Joi.string().uri()).optional(),

  category: Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "any.required": "Category is required",
    "string.pattern.base": "Invalid category ID format", 
  })
  .custom(async (value, helpers) => {
    try {
      const categoryExist = await Category.findById(value);
      if (!categoryExist) {
        throw new appError("Category not found", 400, status.Fail);
      }
      return value;
    } catch (err) {
      throw new appError("Database error while checking category", 500, status.Fail);
    }
  }),


});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    return next(new appError(message, 400, status.Fail));
  }

  next();
};

module.exports = validateProduct;
