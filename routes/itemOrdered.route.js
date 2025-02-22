const express = require("express");
const router = express.Router();
const itemOrderedController = require("../controllers/itemOrdered.controllers");
const validateItemOrderedSchema = require("../middlewares/validateItemOrdered");
const validateItemOrderedID = require("../middlewares/validateItemOrderedID");

router.route("/")
    .post(validateItemOrderedSchema, itemOrderedController.createItemOrdered)
    .get(itemOrderedController.getAllItemOrdered)
    .delete(itemOrderedController.deleteAllItemOrdered);
router.route("/:id")
    .get(validateItemOrderedID, itemOrderedController.getItemOrderedById)
    .delete(validateItemOrderedID, itemOrderedController.deleteItemOrderedById)
    .put(validateItemOrderedID, validateItemOrderedSchema, itemOrderedController.updateItemOrderedById)
    .patch(validateItemOrderedID, validateItemOrderedSchema, itemOrderedController.updatePartialyItemOrderedById);
module.exports = router;
