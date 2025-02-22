const express = require("express");
const router = express.Router();
const itemOrderedController = require("../controllers/itemOrdered.controllers");
const validateItemOrdered = require("../middlewares/validateItemOrdered");

router.route("/").post(validateItemOrdered, itemOrderedController.createItemOrdered)
module.exports = router;
