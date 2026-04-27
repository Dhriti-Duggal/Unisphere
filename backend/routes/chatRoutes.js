const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyThreads,
  getThreadMessages,
  getOrCreateCourseGroupThread,
  getOrCreateDirectThread,
  postMessage,
  markThreadAsRead,
} = require("../controllers/chatController");

router.get("/threads", protect, getMyThreads);
router.get("/threads/:id/messages", protect, getThreadMessages);
router.post("/threads/group", protect, getOrCreateCourseGroupThread);
router.post("/threads/direct", protect, getOrCreateDirectThread);
router.post("/threads/:id/messages", protect, postMessage);
router.patch("/threads/:id/read", protect, markThreadAsRead);

module.exports = router;
