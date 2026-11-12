const router = require("express").Router();
const c = require("../controllers/order.controllers");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", c.createOrder);
router.get("/", c.getMyOrders);
router.get("/:id", c.getOrderById);
router.post("/:id/pay", c.payOrder);
router.put("/:id/cancel", c.cancelOrder);

module.exports = router;
