const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyThreads,
  getThreadMessages,
  getOrCreateCourseGroupThread,
  getOrCreateDirectThread,
  postMessage,
} = require("../controllers/chatController");

router.get("/threads", protect, getMyThreads);
router.get("/threads/:id/messages", protect, getThreadMessages);
router.post("/threads/group", protect, getOrCreateCourseGroupThread);
router.post("/threads/direct", protect, getOrCreateDirectThread);
router.post("/threads/:id/messages", protect, postMessage);

module.exports = router;
