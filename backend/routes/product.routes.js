const router = require("express").Router();
const { getAllProducts } = require("../controllers/product.controllers");

router.get("/", getAllProducts);

module.exports = router;