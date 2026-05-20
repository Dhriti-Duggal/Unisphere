const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserContext } = require("../controllers/botController");

router.get("/context", protect, getUserContext);

module.exports = router;
