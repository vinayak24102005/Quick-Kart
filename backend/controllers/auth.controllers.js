const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400);
      throw new Error("Please enter a valid email address");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Duplicate emails are turned into a 409 by the error middleware (unique index)
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// Returns the currently logged-in user (used to restore a session on page load)
const me = async (req, res) => {
  res.status(200).json({ user: publicUser(req.user) });
};

module.exports = { register, login, me, publicUser };
