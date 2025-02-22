const sendResponse = require("../utils/sendResponse.js");
const status = require("../utils/status.js");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  sendResponse(res, status.Error, 500, null, "Internal Server Error");
};

module.exports = errorHandler;
