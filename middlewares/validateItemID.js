const validator = require('validator');
const sendResponse = require('../utils/sendResponse');

const validateItemID = async (req, res, next) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Item Ordered ID must be a valid MongoId");
  }
  next();
};
module.exports = validateItemID;
