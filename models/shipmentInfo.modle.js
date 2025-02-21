const mongoose = require("mongoose");
const shipmentInfoSchema = new mongoose.Schema({ 
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    phones: [{
        type: String,
        required: true,
    }],
});
const ShipmentInfo = mongoose.model("ShipmentInfo", shipmentInfoSchema);
module.exports = { ShipmentInfo };