const mongoose = require('mongoose');
const userAddressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
    },
});
const UserAddress = mongoose.model('UserAddress', userAddressSchema);
module.exports = { UserAddress };