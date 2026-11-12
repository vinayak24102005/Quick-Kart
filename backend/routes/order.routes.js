const router = require("express").Router();
const orderController = require("../controllers/order.controllers");
const { protect } = require("../middleware/authMiddleware");

// Every order route needs a logged-in user
router.use(protect);

router.post("/", orderController.createOrder);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.post("/:id/pay", orderController.payOrder);
router.patch("/:id/cancel", orderController.cancelOrder);

module.exports = router;
