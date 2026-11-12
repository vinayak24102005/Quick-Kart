const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const ADDRESS_FIELDS = ["fullName", "phone", "address", "city", "postalCode"];
const PAYMENT_METHODS = ["card", "upi", "cod"];

const round2 = (n) => Math.round(n * 100) / 100;

// Puts stock back (used when an order fails halfway or is cancelled)
const restoreStock = (items) =>
    Promise.all(
        items.map((item) =>
            Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
        )
    );

// Finds one of the logged-in user's orders. Other people's orders are
// reported as "not found", so ids can't be used to peek at them.
const findMyOrder = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    return order;
};

// POST /api/orders   body: { shippingAddress: { fullName, phone, address, city, postalCode } }
// Turns the user's cart into an order (the "checkout" step):
//   1. check the address and that the cart is not empty
//   2. take the items out of stock
//   3. save the order, then empty the cart
// Payment is a separate step afterwards (see payOrder).
const createOrder = async (req, res, next) => {
    try {
        // 1. Check the address
        const { shippingAddress } = req.body;
        const address = {};
        for (const field of ADDRESS_FIELDS) {
            const value = shippingAddress && shippingAddress[field];
            if (typeof value !== "string" || value.trim() === "") {
                res.status(400);
                throw new Error("Please fill in all shipping address fields");
            }
            address[field] = value.trim();
        }

        // ...and the cart
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            res.status(400);
            throw new Error("Your cart is empty");
        }

        // The order uses the product's CURRENT name and price, not what the
        // cart remembered, so nobody can buy at an out-of-date price.
        const orderItems = cart.items.map((item) => {
            if (!item.product) {
                res.status(400);
                throw new Error("A product in your cart is no longer available");
            }
            return {
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity
            };
        });

        const total = round2(
            orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        );

        // 2 + 3. Take the stock and save the order.
        // If anything fails, the stock we already took is given back.
        const reserved = [];
        let order;
        try {
            for (const item of orderItems) {
                // Only succeeds if enough stock is left (checked and reduced in one step)
                const result = await Product.updateOne(
                    { _id: item.product, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } }
                );
                if (result.modifiedCount === 0) {
                    res.status(400);
                    throw new Error(`Not enough stock for "${item.name}"`);
                }
                reserved.push(item);
            }

            order = await Order.create({
                user: req.user._id,
                items: orderItems,
                shippingAddress: address,
                total
            });
        } catch (error) {
            await restoreStock(reserved);
            throw error;
        }

        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
}

// GET /api/orders  - the logged-in user's orders, newest first
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
    try {
        const order = await findMyOrder(req, res);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

// POST /api/orders/:id/pay   body: { method: "card" | "upi" | "cod" }
// DEMO payment: no real money moves and no card details are collected.
//   - card / upi  -> the order is marked "paid" straight away
//   - cod         -> stays "pending" (cash is paid on delivery)
const payOrder = async (req, res, next) => {
    try {
        const { method } = req.body;

        if (!PAYMENT_METHODS.includes(method)) {
            res.status(400);
            throw new Error("Please choose a payment method");
        }

        const order = await findMyOrder(req, res);

        if (order.status === "cancelled") {
            res.status(400);
            throw new Error("This order was cancelled");
        }
        if (order.paymentStatus === "paid") {
            res.status(400);
            throw new Error("This order is already paid");
        }

        order.paymentMethod = method;
        if (method !== "cod") {
            order.paymentStatus = "paid";
            order.paidAt = new Date();
        }

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

// PATCH /api/orders/:id/cancel
// Only orders that are still "processing" can be cancelled. The items go
// back into stock, and a paid order is marked "refunded".
const cancelOrder = async (req, res, next) => {
    try {
        // Changes the status only if it is still "processing" (in one step),
        // so cancelling twice can never put the stock back twice.
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id, status: "processing" },
            { status: "cancelled" },
            { new: true }
        );

        if (!order) {
            res.status(400);
            throw new Error("This order was not found or can no longer be cancelled");
        }

        if (order.paymentStatus === "paid") {
            order.paymentStatus = "refunded";
            await order.save();
        }

        await restoreStock(order.items);

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

module.exports = { createOrder, getMyOrders, getOrderById, payOrder, cancelOrder };
