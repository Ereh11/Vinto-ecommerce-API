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


  const shipmentOrder = await ShipmentOrder.find()
    .populate("cart")
    .populate("shipmentInfo")
    .sort({ createdAt: -1 });

  if (!shipmentOrder || shipmentOrder.length === 0) {
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

// GET shipmentOrder by ID
const getShipmentOrder = asyncHandler(async (req, res) => {
  const { cartId } = req.params;

  const shipmentOrder = await ShipmentOrder.findOne({ cart: cartId })
    .populate('cart')
    .populate('shipmentInfo')
    .lean()
    .exec();

  if (!shipmentOrder) {
    return sendResponse(
      res,
      status.Fail,
      404,
      null,
      "No shipment order found for this cart"
    );
  }

  sendResponse(
    res,
    status.Success,
    200,
    { shipmentOrder },
    "Shipment order retrieved successfully"
  );
});

// GET shipmentOrder by CartId
const getShipmentOrderByCartId = asyncHandler(async (req, res) => {
  try {
    const cartId = req.params.cartId;

    console.log(cartId)
    const shipmentOrder = await ShipmentOrder.findOne({ cart: cartId })
      .populate('cart')
      .populate('shipmentInfo')
      .lean();

    console.log(shipmentOrder)
    if (!shipmentOrder) {
      return res.status(404).json({
        status: "FAIL",
        code: 404,
        data: null,
        message: { text: "No shipment order found for this cart" }
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: { shipmentOrder },  // Single object, not array
      message: { text: "Shipment order retrieved successfully" }
    });

  } catch (error) {
    console.error('Error in getShipmentOrderByCartId:', error);
    res.status(500).json({
      status: "ERROR",
      code: 500,
      data: null,
      message: { text: "Internal server error" }
    });
  }
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
  getShipmentOrderByCartId,
  updateShipmentOrder,
  updatePartialyShipmentOrder,
  deleteShipmentOrder,
  deleteAllShipmentOrder,
};
