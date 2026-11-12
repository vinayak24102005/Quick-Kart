const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server Error";

  // Invalid ObjectId, e.g. /api/products/not-an-id
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (statusCode >= 500) console.error("Error:", err.stack || err.message);

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
module.exports.notFound = notFound;
