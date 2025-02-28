const validator = require("validator");
const sendResponse = require("../utils/sendResponse");
const { status } = require("../utils/status.js");

const validateCategoryID = async (req, res, next) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      { category: null },
      "Category ID must be a valid MongoId"
    );
  }
  next();
};
module.exports = validateCategoryID;
