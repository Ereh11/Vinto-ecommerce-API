const validator = require('validator');
const appError = require('../utils/appError');


const validateItemID = async (req, res, next) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return next(new appError('Invalid item ID format', 400));
  }
  next();
};
module.exports = validateItemID;
