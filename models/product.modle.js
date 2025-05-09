const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  characteristics: [
    {
      type: String,
    },
  ],
  img: [
    {
      type: String,
    },
  ],
  addedAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
