const Joi = require("joi");
const appError = require("../../utils/appError");

const categorySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .pattern(/^[a-zA-Z\s]+$/) // Only alphabetic characters and spaces allowed
    .required()
    .messages({
      "string.base": "Title must be a string",
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 3 characters long",
      "string.pattern.base": "Title must only contain letters and spaces",
    }),
  img: Joi.string().uri().optional(),
});

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    throw new appError(message, 400, "FAIL");
  }

  next();
};

module.exports = validateCategory;
