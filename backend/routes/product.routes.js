const router = require("express").Router();
const productController = require("../controllers/product.controllers");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/categories", productController.getCategories); // must be before "/:id"
router.get("/:id", productController.getProductById);

// Admin only
router.post("/", protect, adminOnly, productController.createProduct);
router.put("/:id", protect, adminOnly, productController.updateProduct);
router.delete("/:id", protect, adminOnly, productController.deleteProduct);

module.exports = router;
