const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const errorMiddleware = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 3000;

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration (which website is allowed to call this API)
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Express 5 leaves req.body undefined when a request has no body.
// Make it an empty object so controllers can always read from it safely.
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Unknown URL -> 404 (goes to the error middleware below)
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
