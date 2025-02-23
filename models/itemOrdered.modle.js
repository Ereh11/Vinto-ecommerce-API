const mongoose = require("mongoose");
const itemOrderedSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    quantity: {
        type: Number,
        required: true,
    }
});
const ItemOrdered = mongoose.model("ItemOrdered", itemOrderedSchema);
module.exports = { ItemOrdered };