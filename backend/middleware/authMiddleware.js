const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects a route: only logged-in users (with a valid token) can get through.
// The frontend sends the token on every request as:
//     Authorization: Bearer <token>
// When the token is good, the logged-in user is available as `req.user`.
const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";

        if (!header.startsWith("Bearer ")) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }

        const token = header.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            res.status(401);
            throw new Error("Not authorized, token is invalid or expired");
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

module.exports = { protect };
