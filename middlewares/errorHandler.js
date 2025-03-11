const sendResponse = require("../utils/sendResponse.js");
const AppError = require("../utils/appError");
const status = require("../utils/status");

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof AppError)) {
    statusCode = 500;
    message = "Internal Server Error";
    console.error("Unexpected Error:", err);
  }

  sendResponse(res, status.Fail, statusCode, null, message);
};

module.exports = errorHandler;
