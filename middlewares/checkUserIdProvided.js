const checkUserIdProvided = (req, res, next) => {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        status: "FAIL",
        message: "No userId provided",
        data: null,
        statusCode: 400
      });
    }
  
    next(); // Proceed to the next middleware or route handler if `userId` exists
};

module.exports = checkUserIdProvided;