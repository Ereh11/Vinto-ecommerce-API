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
  stripeSessionId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "In-Proccess",
    required: true,
  },
  dateOfOrder: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateOfDelivery: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
});
const ShipmentOrder = mongoose.model("ShipmentOrder", shipmentOrderSchema);

module.exports = { ShipmentOrder };
