const sendResponse = require('../utils/sendResponse');
const validateItemOrdered = (req, res, next) => {
    const { product, user, quantity } = req.body;
    
    if (!product || !quantity || !user) {
        return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, { text: 'Item, quantity, and price are required' });
    }
    if (isNaN(quantity)) {
        return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, { text: 'Quantity and price must be numbers' });
    }
    next();
};

module.exports = validateItemOrdered;