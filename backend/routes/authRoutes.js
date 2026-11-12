const express = require("express");
const authController = require("../controllers/auth.controllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", authController.register );

router.post("/login", authController.login );

router.put("/profile", protect, authController.updateProfile );

module.exports = router;
