const sendResponse = require("../utils/sendResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const status = require("../utils/status");
const { ShipmentInfo } = require("../models/shipmentInfo.modle");
// POST shipmentInfo
const createShipmentInfo = asyncHandler(async (req, res) => {
  const { user, city, state, street, zipCode, phones } = req.body;
  const shipmentInfo = new ShipmentInfo({
    user,
    city,
    state,
    street,
    zipCode,
    phones,
  });
  await shipmentInfo.save();

  sendResponse(
    res,
    status.Success,
    201,
    { shipmentInfo },
    "ShipmentInfo created successfully"
  );
});
// GET all shipmentInfo
const getAllShipmentInfo = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.find();
  if (shipmentInfo.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "No ShipmentInfo found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "All ShipmentInfo fetched successfully"
  );
});
// GET shipmentInfo by ID
const getShipmentInfoById = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.findById(req.params.id);
  if (!shipmentInfo) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "ShipmentInfo not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "ShipmentInfo fetched successfully"
  );
});
// PUT shipmentInfo by ID
const updateShipmentInfo = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!shipmentInfo) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "ShipmentInfo not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "ShipmentInfo updated successfully"
  );
});
// PATCH shipmentInfo by ID
const updatePartialyShipmentInfo = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!shipmentInfo) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "ShipmentInfo not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "ShipmentInfo updated successfully"
  );
});
// DELETE shipmentInfo by ID
const deleteShipmentInfoByID = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.findByIdAndDelete(req.params.id);
  if (!shipmentInfo) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "ShipmentInfo not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "ShipmentInfo deleted successfully"
  );
});
// DELETE all shipmentInfo
const deleteAllShipmentInfo = asyncHandler(async (req, res) => {
  const shipmentInfo = await ShipmentInfo.deleteMany();
  if (shipmentInfo.deletedCount === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentInfo: null },
      "ShipmentInfo not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentInfo },
    "All ShipmentInfo deleted successfully"
  );
});

module.exports = {
  createShipmentInfo,
  getAllShipmentInfo,
  getShipmentInfoById,
  updateShipmentInfo,
  deleteShipmentInfoByID,
  updatePartialyShipmentInfo,
  deleteAllShipmentInfo,
};
