const Product = require("../models/Product");

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        const productCount = await Product.countDocuments();

        res.status(200).json({ products, productCount });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllProducts };