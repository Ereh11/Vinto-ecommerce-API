const Joi = require("joi");
const mongoose = require("mongoose");
const status = require("../../utils/status.js");
const appError = require("../../utils/appError.js");

const itemOrderedSchema = Joi.object({
  product: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid Product ID format");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "Product ID should be a string",
      "any.required": "Product ID is required",
    }),

  user: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid User ID format");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "User ID should be a string",
      "any.required": "User ID is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity should be a number",
      "number.integer": "Quantity should be an integer",
      "number.min": "Quantity must be greater than or equal to 1",
      "any.required": "Quantity is required",
    })
});
const validateItemOrder = (req, res, next) => {
  const { error } = itemOrderedSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    return next(new appError(message, 400, status.Fail));
  }

  next();
};

module.exports = validateItemOrder;
