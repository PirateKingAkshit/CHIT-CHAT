const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { setRandomFallback } = require("bcryptjs");
const router = express.Router();
const {sendMessage,allMessage} = require("../controllers/messageControllers.js");


router.route("/").post(protect,sendMessage)
router.route("/:chatId").get(protect, allMessage)

module.exports = router;
