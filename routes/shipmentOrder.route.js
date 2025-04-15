const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
//const { hasShipmentAccess } = require("../middlewares/roleAuth");
const shipmentOrderController = require("../controllers/shipmentOrder.controllers.js");
const validateShipmentOrder = require("../middlewares/validateShipmentOrder.js");
const validateItemID = require("../middlewares/validateItemID.js");

router.use(protect);

router.post(
  "/",
  shipmentOrderController.createShipmentOrder
);
router.get("/", shipmentOrderController.getAllShipmentOrder);
router.delete(
  "/",
  shipmentOrderController.deleteAllShipmentOrder
);

router
  .route("/:id")
  .get(validateItemID, shipmentOrderController.getShipmentOrder)
  .put(validateItemID, shipmentOrderController.updateShipmentOrder)
  .patch(validateItemID, shipmentOrderController.updatePartialyShipmentOrder)
  .delete(validateItemID, shipmentOrderController.deleteShipmentOrder);

router
  .route("/progress/:cartId")
  .get(shipmentOrderController.getShipmentOrderByCartId);

module.exports = router;
