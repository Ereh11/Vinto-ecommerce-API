const express = require("express");
const router = express.Router();
const itemOrderedController = require("../controllers/itemOrdered.controllers");
const validateItemOrder = require("../middlewares/validations/validateItemOrder");
const validateObjectId = require("../middlewares/validateObjectId");

router.route("/")
    .get(itemOrderedController.getAllItemOrdered)
    .post(validateItemOrder, itemOrderedController.createItemOrdered)
    .delete(itemOrderedController.deleteAllItemOrdered);
router.route("/:id")
    .get(validateObjectId("id"), itemOrderedController.getItemOrderedById)
    .delete(validateObjectId("id"), itemOrderedController.deleteItemOrderedById)
    .put(validateObjectId("id"), validateItemOrder, itemOrderedController.updateItemOrderedById)
    .patch(validateObjectId("id"), itemOrderedController.updatePartialyItemOrderedById);
    
module.exports = router;
