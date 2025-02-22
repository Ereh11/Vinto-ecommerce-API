const sendResponse = require('../utils/sendResponse');
const { User } = require('../models/user.modle');
const { Product } = require('../models/product.modle');
const moongose = require('mongoose');
const validator = require('validator');
const validateItemOrderedSchema = async (req, res, next) => {
    try {
        // Required fields validation
        const { product, user, quantity } = req.body;
        if (!product) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Product is required");
        if (!user) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "User is required");
        if (!quantity) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Quantity is required");

        // Format validation
        if (!validator.isMongoId(product)) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Product must be a valid MongoId");
        if (!validator.isMongoId(user)) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "User must be a valid MongoId");
        if (!validator.isNumeric(quantity)) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Quantity must be a number");
        if (quantity <= 0) return sendResponse(res, "FAIL", 400, { itemOrdered: null }, "Quantity must be a positive number");

        // Existence validation
        const userExistance = await moongose.model('User').exists({ _id: user });
        const productExistance = await moongose.model('Product').exists({ _id: product });
        if (!userExistance) return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, "User does not exist");
        if (!productExistance) return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, "Product does not exist");
    } catch (error) {
        return sendResponse(res, 'FAIL', 500, { itemOrdered: null }, error.message);
    }
    next();
};

module.exports = validateItemOrderedSchema;