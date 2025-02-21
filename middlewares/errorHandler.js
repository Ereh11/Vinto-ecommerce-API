const sendResponse = require("../utils/sendResponse.js");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  sendResponse(res, "ERROR", 500, null, { text: "Internal Server Error" });
};

module.exports = errorHandler;
