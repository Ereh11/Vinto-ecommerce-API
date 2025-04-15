const status = require("../utils/status");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;  // Default to 500 if no statusCode
  err.status = err.status || 'error';      // Default to 'error' if no status

  // If error is operational, send the response with status code, message, and other details
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      data: err.data || null,
      code: err.statusCode // ✅ Add statusCode here
    });
  } else {
    console.error('ERROR ON THE SERVER!💥', err);
    return res.status(500).json({
      status: status.Error,
      message: 'Something went wrong on the server!',
      data: null,
      statusCode: 500 // Add default server error statusCode
    });
  }
};

module.exports = errorHandler;
