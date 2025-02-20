const mongoose = require('mongoose');
const wishedListSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const WishedList = mongoose.model('WishedList', wishedListSchema);
module.exports = { WishedList };