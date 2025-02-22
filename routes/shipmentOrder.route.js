const express = require("express");
const router = express.Router();
const shipmentOrderController = require("../controllers/shipmentOrder.controllers.js");
const validateShipmentOrder = require("../middlewares/validateShipmentOrder.js");
const validateItemID = require("../middlewares/validateItemID.js");


router.route("/")
    .post(validateShipmentOrder, shipmentOrderController.createShipmentOrder)
    .get(shipmentOrderController.getAllShipmentOrder)
    .delete(shipmentOrderController.deleteAllShipmentOrder)

router.route("/:id")
    .get(validateItemID, shipmentOrderController.getShipmentOrder)
    .put(validateItemID, shipmentOrderController.updateShipmentOrder)
    .patch(validateItemID, shipmentOrderController.updatePartialyShipmentOrder)
    .delete(validateItemID, shipmentOrderController.deleteShipmentOrder)

module.exports = router;
