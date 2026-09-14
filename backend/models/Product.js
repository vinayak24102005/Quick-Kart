const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = model("Product", productSchema);