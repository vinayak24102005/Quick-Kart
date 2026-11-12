const router = require("express").Router();
const c = require("../controllers/user.controllers");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/me", c.getProfile);
router.put("/me", c.updateProfile);
router.put("/me/password", c.changePassword);

module.exports = router;
