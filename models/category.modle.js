const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
    }
});
const Category = mongoose.model('Category', categorySchema);
module.exports = { Category };