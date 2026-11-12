const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: [0, "Price can not be negative."] },
    image: { type: String },
    category: { type: String, trim: true },
    stock: { type: Number, default: 0, min: [0, "Stock can not be negative."] },
  },
  { timestamps: true }
);


module.exports = model("Product", productSchema);
