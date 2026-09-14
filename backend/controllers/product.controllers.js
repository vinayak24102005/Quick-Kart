const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const productCount = await Product.countDocuments();

        res.status(200).json({ products, productCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllProducts };