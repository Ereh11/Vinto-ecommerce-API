const asyncHandler = require("./asyncHandler");
const User = require("../models/user.modle");

exports.restrictTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  });
};

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "This route is restricted to admin users",
    });
  }
  next();
});

// exports.hasShipmentAccess = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   if (!user || !["admin"].includes(user.role)) {
//     return res.status(403).json({
//       status: "error",
//       message: "You do not have access to shipment operations",
//     });
//   }
//   next();
// });
