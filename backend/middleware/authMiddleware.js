const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Requires a valid "Authorization: Bearer <token>" header.
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    let decoded;
    try {
      decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Must be used after `protect`.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403);
  next(new Error("Admin access required"));
};

module.exports = { protect, adminOnly };
