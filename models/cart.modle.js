const mongoose = require("mongoose");
const { ItemOrdered } = require("./itemOrdered.modle");
const cartSchema = new mongoose.Schema({
    ItemsOrdered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ItemOrdered,
        required: true
    }],
    status: {
        type: String,
        default: "pending",
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    total: {
        type: Number,
        default: 0,
        required: true
    }
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
