const router = require("express").Router();
const c = require("../controllers/admin.controllers");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);

router.get("/stats", c.getStats);
router.get("/orders", c.getAllOrders);
router.put("/orders/:id/status", c.updateOrderStatus);

module.exports = router;
