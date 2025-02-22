const mongoose = require("mongoose");
const shipmentOrderSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    shipmentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShipmentInfo",
        required: true,
    },
    status: {
        type: String,
        default: "In-Proccess",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
const ShipmentOrder = mongoose.model("ShipmentOrder", shipmentOrderSchema);
module.exports = { ShipmentOrder };
