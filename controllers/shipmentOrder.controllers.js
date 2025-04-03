const sendResponse = require("../utils/sendResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const status = require("../utils/status.js");
const { ShipmentOrder } = require("../models/shipmentOrder.modle.js");

// POST shipmentOrder
const createShipmentOrder = asyncHandler(async (req, res) => {
  const { cart, shipmentInfo } = req.body;

  const shipmentOrder = new ShipmentOrder({ cart, shipmentInfo });
  await shipmentOrder.save();

  sendResponse(
    res,
    status.Success,
    201,
    { shipmentOrder },
    "ShipmentOrder created successfully"
  );
});

// GET ALL ShipmentOrder
const getAllShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.find();
  if (shipmentOrder.length === 0) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "No ShipmentOrder found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "All ShipmentOrder fetched successfully"
  );
});

// GET shipmentOrder by ID
const getShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.findById(req.params.id);
  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "ShipmentOrder not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "ShipmentOrder fetched successfully"
  );
});

// PUT shipmentOrder by ID
const updateShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "ShipmentOrder not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "ShipmentOrder updated successfully"
  );
});

// PATCH shipmentOrder by ID
const updatePartialyShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "ShipmentOrder not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "ShipmentOrder updated successfully"
  );
});

// DELETE shipmentOrder by ID
const deleteShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.findByIdAndDelete(req.params.id);
  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "ShipmentOrder not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "ShipmentOrder deleted successfully"
  );
});

// DELETE all shipmentOrder
const deleteAllShipmentOrder = asyncHandler(async (req, res) => {
  const shipmentOrder = await ShipmentOrder.deleteMany();
  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      { shipmentOrder: null },
      "ShipmentOrder not found"
    );
  }
  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "All ShipmentOrder deleted successfully"
  );
});

module.exports = {
  createShipmentOrder,
  getAllShipmentOrder,
  getShipmentOrder,
  updateShipmentOrder,
  updatePartialyShipmentOrder,
  deleteShipmentOrder,
  deleteAllShipmentOrder,
};
