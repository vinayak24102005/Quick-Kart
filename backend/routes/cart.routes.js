const router = require("express").Router();
const cartController = require("../controllers/cart.controllers");
const { protect } = require("../middleware/authMiddleware");

// Every cart route needs a logged-in user
router.use(protect);

router.get("/", cartController.getCart);
router.delete("/", cartController.clearCart);

router.post("/items", cartController.addToCart);
router.put("/items/:productId", cartController.updateCartItem);
router.delete("/items/:productId", cartController.removeCartItem);

module.exports = router;
