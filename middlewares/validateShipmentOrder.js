const validator = require('validator');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse.js');
const { status } = require('../utils/status');
const { ShipmentInfo } = require('../models/shipmentInfo.modle.js');


const validateShipmentOrder = async (req, res, next) => {
    const { cart, shipmentInfo } = req.body;

    if (!cart) return sendResponse(res, status.Fail, 400, { shipment: null }, "cart is required");
    if (!shipmentInfo) return sendResponse(res, status.Fail, 400, { shipment: null }, "shipmentInfo is required");

    if (!validator.isMongoId(cart)) return sendResponse(res, status.Fail, 400, { shipment: null }, "cart need to be a valid MongoId");
    if (!validator.isMongoId(shipmentInfo)) return sendResponse(res, status.Fail, 400, { shipment: null }, "shipmentInfo need to be a valid MongoId");

    const cartExist = await mongoose.model('Cart').exists({ _id: cart });
    const shipmentInfoExist = await mongoose.model('ShipmentInfo').exists({ _id: shipmentInfo });
    if (!cartExist) return sendResponse(res, status.Fail, 400, { shipment: null }, 'Cart not found');
    if (!shipmentInfoExist) return sendResponse(res, status.Fail, 400, { shipment: null }, 'shipmentInfo not found');


    next();
}

module.exports = validateShipmentOrder;
