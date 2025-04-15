class AppError extends Error {
    constructor(message, statusCode, status, data = null) {
      super(message);
      this.statusCode = statusCode;
      this.status = status;
      this.data = data;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;