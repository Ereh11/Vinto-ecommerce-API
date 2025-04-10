const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const status = require("../utils/status");

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return next(new AppError(`No ${paramName} is provided`, 400, status.Fail));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid ${paramName} format`, 400, status.Fail));
    }

    next();
  };
};

module.exports = validateObjectId;
