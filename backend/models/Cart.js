const mongoose = require('mongoose');

const round2 = (n) => Math.round(n * 100) / 100;

// 1. Cart Item Sub-Schema
// `price` is the product's price at the time it was added/updated.
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price can not be negative.']
  },
  // Filled in automatically by the hook below
  totalPrice: {
    type: Number,
    default: 0
  }
}, { _id: true });

// 2. Main Cart Schema - every user has exactly one cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],

  total: {
    type: Number,
    default: 0
  },
}, {timestamps: true});


// 3. Hook: auto-calculate totals every time the cart is saved.
// It must run on 'validate' (not 'save'): Mongoose validates BEFORE the
// 'save' hooks run, so totals have to exist by then.
cartSchema.pre('validate', function () {
  this.items.forEach(item => {
    item.totalPrice = round2(item.quantity * item.price);
  });

  this.total = round2(this.items.reduce((acc, item) => acc + item.totalPrice, 0));
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
