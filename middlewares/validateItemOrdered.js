const sendResponse = require('../utils/sendResponse');
const validateItemOrdered = (req, res, next) => {
    const { item, quantity, price } = req.body;
    
    if (!item || !quantity || !price) {
        return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, { text: 'Item, quantity, and price are required' });
    }
    if (isNaN(quantity) || isNaN(price)) {
        return sendResponse(res, 'FAIL', 400, { itemOrdered: null }, { text: 'Quantity and price must be numbers' });
    }
    next();
};

module.exports = validateItemOrdered;