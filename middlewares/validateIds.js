const mongoose = require("mongoose");
const sendResponse = require("../utils/sendResponse");
const { status } = require("../utils/status");

const validateIds = (req, res, next) => {
  const { userId, productId } = req.body;
  const { userId: userParamId } = req.params;

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { userId: null },
      "Invalid User ID"
    );
  }

  if (userParamId && !mongoose.Types.ObjectId.isValid(userParamId)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { userId: null },
      "Invalid User ID in URL"
    );
  }

  if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { productId: null },
      "Invalid Product ID"
    );
  }

  next();
};

module.exports = validateIds;
