const mongoose = require('mongoose');
const itemLikedSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const ItemLiked = mongoose.model('ItemLiked', itemLikedSchema);
module.exports = {ItemLiked};