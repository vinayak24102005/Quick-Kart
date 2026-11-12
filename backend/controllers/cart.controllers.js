const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Loads (or creates) the user's cart, drops items whose product was deleted and
// refreshes price snapshots so the cart always matches the catalogue.
const loadCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    try {
      cart = await Cart.create({ user: userId, items: [] });
    } catch (err) {
      // Two requests created a cart at the same moment; the unique index let one win
      if (err.code !== 11000) throw err;
      cart = await Cart.findOne({ user: userId });
    }
  }

  const products = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  let changed = false;
  cart.items = cart.items.filter((item) => {
    const p = byId.get(String(item.product));
    if (!p) { changed = true; return false; }
    if (item.price !== p.price) { item.price = p.price; changed = true; }
    return true;
  });
  if (changed) await cart.save();
  return { cart, byId };
};

// Shape returned to the client
const format = ({ cart, byId }) => ({
  _id: cart._id,
  total: cart.total,
  itemCount: cart.items.reduce((n, i) => n + i.quantity, 0),
  items: cart.items.map((i) => {
    const p = byId.get(String(i.product));
    return {
      _id: i._id,
      product: { _id: p._id, name: p.name, image: p.image, category: p.category, stock: p.stock },
      quantity: i.quantity,
      price: i.price,
      totalPrice: i.totalPrice,
    };
  }),
});

const getCart = async (req, res, next) => {
  try {
    res.status(200).json(format(await loadCart(req.user._id)));
  } catch (error) {
    next(error);
  }
};

const parseQty = (value, res) => {
  const qty = Number(value);
  if (!Number.isInteger(qty) || qty < 1) {
    res.status(400);
    throw new Error("Quantity must be a whole number of at least 1");
  }
  return qty;
};

// POST /api/cart  { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const quantity = parseQty(req.body.quantity ?? 1, res);

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const ctx = await loadCart(req.user._id);
    const existing = ctx.cart.items.find((i) => String(i.product) === String(product._id));
    const newQty = (existing ? existing.quantity : 0) + quantity;

    if (newQty > product.stock) {
      res.status(400);
      throw new Error(
        product.stock === 0 ? "This product is out of stock" : `Only ${product.stock} left in stock`
      );
    }

    if (existing) existing.quantity = newQty;
    else ctx.cart.items.push({ product: product._id, quantity, price: product.price, totalPrice: 0 });

    await ctx.cart.save();
    ctx.byId.set(String(product._id), product);
    res.status(200).json(format(ctx));
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const quantity = parseQty(req.body.quantity, res);
    const ctx = await loadCart(req.user._id);
    const item = ctx.cart.items.find((i) => String(i.product) === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error("Item not in cart");
    }
    const product = ctx.byId.get(String(item.product));
    if (quantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} left in stock`);
    }
    item.quantity = quantity;
    await ctx.cart.save();
    res.status(200).json(format(ctx));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/:productId
const removeCartItem = async (req, res, next) => {
  try {
    const ctx = await loadCart(req.user._id);
    ctx.cart.items = ctx.cart.items.filter((i) => String(i.product) !== req.params.productId);
    await ctx.cart.save();
    res.status(200).json(format(ctx));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const ctx = await loadCart(req.user._id);
    ctx.cart.items = [];
    await ctx.cart.save();
    res.status(200).json(format(ctx));
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
