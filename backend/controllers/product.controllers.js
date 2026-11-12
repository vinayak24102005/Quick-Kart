const Product = require("../models/Product");

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  name: { name: 1 },
};

// GET /api/products?q=&category=&minPrice=&maxPrice=&sort=&page=&limit=
const getAllProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, sort = "newest" } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);

    const filter = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { description: rx }, { category: rx }];
    }
    if (category && category !== "all") filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "" && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "" && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
      if (!Object.keys(filter.price).length) delete filter.price;
    }

    const productCount = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(SORTS[sort] || SORTS.newest)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      productCount,
      page,
      pages: Math.max(Math.ceil(productCount / limit), 1),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = (await Product.distinct("category")).filter(Boolean).sort();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// ---- Admin ----
const PRODUCT_FIELDS = ["name", "description", "price", "image", "category", "stock"];
const pickProduct = (body) =>
  PRODUCT_FIELDS.reduce((acc, k) => (body[k] !== undefined ? { ...acc, [k]: body[k] } : acc), {});

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(pickProduct(req.body));
    res.status(201).json(product);
  } catch (error) {
    if (error.name === "ValidationError") res.status(400);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    product.set(pickProduct(req.body));
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
