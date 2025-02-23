const express = require("express");
const router = express.Router();
const shipmentInfoController = require("../controllers/shipmentInfo.controllers");
const validateShipmentInfoSchema = require("../middlewares/validateShipmentInfo");
const validateItemID = require("../middlewares/validateItemID");

router.route("/")
    .post(validateShipmentInfoSchema, shipmentInfoController.createShipmentInfo)
    .get(shipmentInfoController.getAllShipmentInfo)
    .delete(shipmentInfoController.deleteAllShipmentInfo);
router.route("/:id")
    .get(validateItemID, shipmentInfoController.getShipmentInfoById)
    .delete(validateItemID, shipmentInfoController.deleteShipmentInfoByID)
    .put(validateItemID, validateShipmentInfoSchema, shipmentInfoController.updateShipmentInfo)
    .patch(validateItemID, validateShipmentInfoSchema, shipmentInfoController.updatePartialyShipmentInfo);

module.exports = router;