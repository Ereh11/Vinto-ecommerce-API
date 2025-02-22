const validator = require('validator');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse.js');

const validateShipmentInfoSchema = async (req, res, next) => {
    try {
        const { user, city, state, street, zipCode, phones } = req.body;

        // Required fields validation
        if (!user) return sendResponse(res, "FAIL", 400, { shipment: null }, "User is required");
        if (!city) return sendResponse(res, "FAIL", 400, { shipment: null }, "City is required");
        if (!phones) return sendResponse(res, "FAIL", 400, { shipment: null }, "Phone is required");
        if (!state) return sendResponse(res, "FAIL", 400, { shipment: null }, "State is required");
        if (!street) return sendResponse(res, "FAIL", 400, { shipment: null }, "Street is required");
        if (!zipCode) return sendResponse(res, "FAIL", 400, { shipment: null }, "Zip-Code is required");

        // Format validation
        if (!validator.isMongoId(user)) return sendResponse(res, "FAIL", 400, { shipment: null }, "Usermust be a valid MongoId");
        if (!validator.isAlpha(city)) return sendResponse(res, "FAIL", 400, { shipment: null }, "City must be a string");
        if (!validator.isAlpha(state)) return sendResponse(res, "FAIL", 400, { shipment: null }, "State must be a string");
        if (!validator.isAlpha(street)) return sendResponse(res, "FAIL", 400, { shipment: null }, "Street must be a string");
        if (!validator.isNumeric(zipCode)) return sendResponse(res, "FAIL", 400, { shipment: null }, "Zip-Code must be a number");

        // Existence validation
        const userExist = await mongoose.model('User').exists({ _id: user });
        if (!userExist) return sendResponse(res, 'FAIL', 400, { shipment: null }, 'User not found');

    }
    catch (err) {
        return sendResponse(res, 'FAIL', 500, { shipment: null }, err.message);
    }
    next();
};

module.exports = validateShipmentInfoSchema;