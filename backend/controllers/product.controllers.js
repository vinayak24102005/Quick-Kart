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

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if(!id){
            res.status(400);
            throw new Error("Product ID is required");
        }

        const product = await Product.findById(id);

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllProducts, getProductById };