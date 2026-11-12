const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
      default: 1,
    },
    // Price snapshot at the time the item was added/last synced
    price: { type: Number, required: true, min: [0, "Price can not be negative."] },
    totalPrice: { type: Number, required: true },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One cart per user (guest carts with user=null are not restricted)
cartSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { user: { $type: "objectId" } } });

// Auto-calculate totals before saving. (Synchronous hook: works on Mongoose 8 and 9.)
cartSchema.pre("save", function () {
  this.items.forEach((item) => {
    item.totalPrice = item.quantity * item.price;
  });
  this.total = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
