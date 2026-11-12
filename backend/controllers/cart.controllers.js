const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Finds the logged-in user's cart (and creates an empty one the first time)
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

// Every cart endpoint answers with the whole cart, with each item's product
// filled in (name, image, stock...), so the frontend can just show it.
const sendCart = async (res, cart) => {
    await cart.populate("items.product");

    const data = cart.toObject();

    // Skip items whose product no longer exists, and keep the total honest
    data.items = data.items.filter((item) => item.product);
    data.total = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

    res.status(200).json(data);
};

// Reads and checks the quantity sent by the frontend
const readQuantity = (res, value) => {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400);
        throw new Error("Quantity must be a whole number of 1 or more");
    }
    return quantity;
};

// GET /api/cart
const getCart = async (req, res, next) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        await sendCart(res, cart);
    } catch (error) {
        next(error);
    }
}

// POST /api/cart/items   body: { productId, quantity }
// Adds a product, or increases its quantity if it is already in the cart.
const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const quantity = readQuantity(res, req.body.quantity ?? 1);

        if (typeof productId !== "string" || !productId) {
            res.status(400);
            throw new Error("Product ID is required");
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        const cart = await getOrCreateCart(req.user._id);
        const existing = cart.items.find((item) => item.product.toString() === productId);
        const newQuantity = (existing ? existing.quantity : 0) + quantity;

        if (newQuantity > product.stock) {
            res.status(400);
            throw new Error(`Only ${product.stock} of "${product.name}" in stock`);
        }

        if (existing) {
            existing.quantity = newQuantity;
            existing.price = product.price;
        } else {
            cart.items.push({ product: product._id, quantity, price: product.price });
        }

        await cart.save();
        await sendCart(res, cart);
    } catch (error) {
        next(error);
    }
}

// PUT /api/cart/items/:productId   body: { quantity }
// Sets the quantity of a product that is already in the cart.
const updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const quantity = readQuantity(res, req.body.quantity);

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        const cart = await getOrCreateCart(req.user._id);
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            res.status(404);
            throw new Error("This product is not in your cart");
        }

        if (quantity > product.stock) {
            res.status(400);
            throw new Error(`Only ${product.stock} of "${product.name}" in stock`);
        }

        item.quantity = quantity;
        item.price = product.price;

        await cart.save();
        await sendCart(res, cart);
    } catch (error) {
        next(error);
    }
}

// DELETE /api/cart/items/:productId
const removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await getOrCreateCart(req.user._id);
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        await cart.save();
        await sendCart(res, cart);
    } catch (error) {
        next(error);
    }
}

// DELETE /api/cart
const clearCart = async (req, res, next) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = [];

        await cart.save();
        await sendCart(res, cart);
    } catch (error) {
        next(error);
    }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
