const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { calcShipping } = require("../utils/pricing");

const PAYMENT_METHODS = ["cod", "card", "upi"];

// Put reserved stock back (used when an order is cancelled or creation fails midway)
const restoreStock = async (items) => {
  await Promise.all(
    items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } }))
  );
};

// POST /api/orders  { shippingAddress, paymentMethod }  -> creates an order from the user's cart
const createOrder = async (req, res, next) => {
  const reserved = [];
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      res.status(400);
      throw new Error("Please choose a valid payment method");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty");
    }

    const products = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    for (const item of cart.items) {
      const p = byId.get(String(item.product));
      if (!p) {
        res.status(400);
        throw new Error("A product in your cart is no longer available. Please review your cart.");
      }
      orderItems.push({
        product: p._id,
        name: p.name,
        image: p.image,
        price: p.price, // always the current catalogue price
        quantity: item.quantity,
      });
    }

    // Reserve stock atomically, one product at a time (works without replica-set transactions)
    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount !== 1) {
        await restoreStock(reserved);
        res.status(400);
        throw new Error(`Not enough stock for "${item.name}". Please update your cart.`);
      }
      reserved.push(item);
    }

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = calcShipping(itemsTotal);

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsTotal,
        shippingFee,
        total: itemsTotal + shippingFee,
      });
    } catch (err) {
      await restoreStock(reserved); // e.g. address validation failed
      throw err;
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders  -> the logged-in user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

const findOwnOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  // Same message for "missing" and "someone else's" so ids can't be probed
  if (!order || String(order.user) !== String(req.user._id)) {
    res.status(404);
    throw new Error("Order not found");
  }
  return order;
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    res.status(200).json(await findOwnOrder(req, res));
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/pay  (simulated gateway: marks an online-payment order as paid)
const payOrder = async (req, res, next) => {
  try {
    const order = await findOwnOrder(req, res);

    if (order.status === "cancelled") {
      res.status(400);
      throw new Error("This order was cancelled");
    }
    if (order.paymentMethod === "cod") {
      res.status(400);
      throw new Error("Cash on delivery orders are paid when the order arrives");
    }
    if (order.paymentStatus === "paid") {
      res.status(400);
      throw new Error("This order is already paid");
    }

    order.paymentStatus = "paid";
    order.paidAt = new Date();
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await findOwnOrder(req, res);

    if (!["placed", "processing"].includes(order.status)) {
      res.status(400);
      throw new Error(`An order that is ${order.status} can no longer be cancelled`);
    }

    order.status = "cancelled";
    if (order.paymentStatus === "paid") order.paymentStatus = "refunded";
    await order.save();
    await restoreStock(order.items);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, payOrder, cancelOrder, restoreStock };
