const mongoose = require("mongoose");
const wishedListSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});
const WishedList = mongoose.model("WishedList", wishedListSchema);
module.exports = { WishedList };
