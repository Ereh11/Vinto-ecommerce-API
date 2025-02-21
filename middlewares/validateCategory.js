const sendResponse = require("../utils/sendResponse.js");

const validateCategory = (req, res, next) => {
  const { title } = req.body;

  if (!title?.trim()) {
    return sendResponse(
      res,
      "FAIL",
      400,
      { category: null },
      { text: "Title is required" }
    );
  }

  if (!isNaN(title)) {
    return sendResponse(
      res,
      "FAIL",
      400,
      { category: null },
      { text: "Title must be a string" }
    );
  }

  next();
};

module.exports = validateCategory;
