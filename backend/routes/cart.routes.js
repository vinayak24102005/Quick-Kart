const router = require("express").Router();
const c = require("../controllers/cart.controllers");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", c.getCart);
router.post("/", c.addToCart);
router.delete("/", c.clearCart);
router.put("/:productId", c.updateCartItem);
router.delete("/:productId", c.removeCartItem);

module.exports = router;
