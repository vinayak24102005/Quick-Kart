// Every error in the app ends up here (controllers call next(error)).
// It sends back one consistent shape:  { success: false, message: "..." }
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err.message);

  // Controllers set the status first (res.status(400)) and then throw.
  // If nobody set one, it is an unexpected error, so use 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server Error";

  // Invalid MongoDB id, e.g. GET /api/products/abc
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  }

  // A model rule failed, e.g. a required field is missing
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Duplicate value on a unique field, e.g. the same email twice
  if (err.code === 11000) {
    statusCode = 400;
    message = "That value is already in use";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
