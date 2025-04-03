const express = require("express");
const router = express.Router();
const itemOrderedController = require("../controllers/itemOrdered.controllers");
const validateItemOrderedSchema = require("../middlewares/validateItemOrdered");
const validateItemID = require("../middlewares/validateItemID");

router.route("/")
    .get(itemOrderedController.getAllItemOrdered)
    .post(validateItemOrderedSchema, itemOrderedController.createItemOrdered)
    .delete(itemOrderedController.deleteAllItemOrdered);
router.route("/:id")
    .get(validateItemID, itemOrderedController.getItemOrderedById)
    .delete(validateItemID, itemOrderedController.deleteItemOrderedById)
    .put(validateItemID, validateItemOrderedSchema, itemOrderedController.updateItemOrderedById)
    .patch(validateItemID, validateItemOrderedSchema, itemOrderedController.updatePartialyItemOrderedById);
    
module.exports = router;
