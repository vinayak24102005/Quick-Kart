const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { restoreStock } = require("./order.controllers");

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];
const LOW_STOCK = 5;

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [users, products, orders, revenueAgg, byStatus, lowStock, recentOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, revenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Product.find({ stock: { $lte: LOW_STOCK } }).sort({ stock: 1 }).limit(10).select("name stock"),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email"),
    ]);

    res.status(200).json({
      users,
      products,
      orders,
      revenue: revenueAgg[0]?.revenue || 0,
      ordersByStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      lowStock,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders?status=
const getAllOrders = async (req, res, next) => {
  try {
    const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate("user", "name email");
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/orders/:id/status  { status }
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${STATUSES.join(", ")}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (["cancelled", "delivered"].includes(order.status) && order.status !== status) {
      res.status(400);
      throw new Error(`A ${order.status} order can not be changed`);
    }

    if (status === "cancelled" && order.status !== "cancelled") {
      await restoreStock(order.items);
      if (order.paymentStatus === "paid") order.paymentStatus = "refunded";
    }
    if (status === "delivered" && order.paymentStatus === "pending" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid"; // cash collected on delivery
      order.paidAt = new Date();
    }

    order.status = status;
    await order.save();
    await order.populate("user", "name email");
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllOrders, updateOrderStatus };
