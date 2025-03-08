const { check, validationResult } = require("express-validator");
const appError = require("../utils/appError.js");

const validateschema = [
  check("title", "Title is required").notEmpty(),
  check("price", "Price is required and must be a number").isNumeric(),
  check("describe", "Description is required").notEmpty(),
  check("rate", "Rate is required and must be a number").isNumeric(),
  check("discount", "Discount is required and must be a number").isNumeric(),
  check("quantity", "Quantity is required and must be a number").isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new appError(errors.array().map((err) => err.msg).join(", "), 400));
    }
    next();
  },
];

module.exports = validateschema;
