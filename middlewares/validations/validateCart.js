const Joi = require("joi");
const mongoose = require("mongoose");
const appError = require("../../utils/appError");
const status  = require("../../utils/status");

const cartSchema = Joi.object({
  ItemsOrdered: Joi.array()
    .items(Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid ItemOrdered ID format");
      }
      return value;
    }).required())
    .required()
    .messages({
      "array.base": "ItemsOrdered should be an array",
      "array.empty": "ItemsOrdered cannot be empty",
      "any.required": "ItemsOrdered is required",
    }),

  status: Joi.string()
    .valid("pending", "completed", "cancelled")
    .default("pending")
    .required()
    .messages({
      "string.base": "Status should be a string",
      "any.required": "Status is required",
      "any.only": "Status must be one of 'pending', 'completed', 'cancelled'",
    }),

  date: Joi.date()
    .default(Date.now)
    .required()
    .messages({
      "date.base": "Date must be a valid date",
      "any.required": "Date is required",
    }),

  total: Joi.number()
    .min(0)
    .default(0)
    .required()
    .messages({
      "number.base": "Total should be a number",
      "number.min": "Total must be greater than or equal to 0",
      "any.required": "Total is required",
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
});

const validateCart = (req, res, next) => {
  const { error } = cartSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    throw new appError(
      status.Fail,
      message || "Invalid cart data",
      "validateCart"
    );
  }

  next();
};

exports.validateCart = validateCart;
