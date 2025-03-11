const sendResponse = require('../utils/sendResponse');
const mongoose = require('mongoose');
const { ItemOrdered } = require('../models/itemOrdered.modle.js');


const { status } = require('../utils/status');

const validateCart = async (req, res, next) => {
  const { ItemsOrdered } = req.body;

  if (!ItemsOrdered) return sendResponse(res, status.Fail, 400, { Cart: null }, { text: 'itemOrdered are required' });

  if (!Array.isArray(ItemsOrdered)) {
    return sendResponse(
      res,
      status.Fail,
      400,
      null,
      'ItemsOrdered must be an array'
    );
  }

  if (ItemsOrdered.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      400,
      null,
      'ItemsOrdered array cannot be empty'
    );
  }

  if (!ItemsOrdered.every(id => mongoose.Types.ObjectId.isValid(id))) {
    return sendResponse(
      res,
      status.Fail,
      400,
      null,
      'One or more product IDs are invalid'
    );
  }

  const count = await ItemOrdered.countDocuments({ _id: { $in: ItemsOrdered } });
  if (count !== ItemsOrdered.length) {
    return sendResponse(
      res,
      status.Fail,
      400,
      null,
      'One or more products do not exist'
    );
  }

  next();
};

module.exports = validateCart;

