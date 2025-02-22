const {ItemOrdered} = require('../models/itemOrdered.modle');
const sendResponse = require('../utils/sendResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const {status} = require('../utils/status');

// Post
exports.createItemOrdered = asyncHandler(async (req, res) => {
    const {product, user, quantity} = req.body;
    const itemOrderedInstance = new ItemOrdered({product, user, quantity});
    await itemOrderedInstance.save();

    sendResponse(
        res,
        status.Success,
        201,
        {itemOrderedInstance},
        'Item Ordered created successfully'
    );
});