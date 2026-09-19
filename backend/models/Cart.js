const mongoose = require('mongoose');

// 1. Cart Item Sub-Schema
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
  totalPrice: {
    type: Number,
    required: true
  }
}, { _id: true });

// 2. Main Cart Schema
const cartSchema = new mongoose.Schema({
  // Associate with a user, or a session ID for guest checkouts
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  items: [cartItemSchema],
  
  total: {
    type: Number,
    default: 0
  },
}, {timestamps: true});


// 3. Pre-save Hook: Auto-calculate totals before saving to the database
cartSchema.pre('save', function (next) {
  const cart = this;

  // Calculate individual item totals
  cart.items.forEach(item => {
    item.totalPrice = item.quantity * item.price;
  });

  // Calculate cart total
  cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;