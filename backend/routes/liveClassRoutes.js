const express = require("express");
const router = express.Router();
const { protect, authorizeTeacher } = require("../middleware/authMiddleware");
const {
  scheduleLiveClass, getCourseLiveClasses, getGroupLiveClasses, getUpcomingLiveClasses,
} = require("../controllers/liveClassController");

router.post("/", protect, authorizeTeacher, scheduleLiveClass);
router.get("/upcoming", protect, getUpcomingLiveClasses);
router.get("/course/:courseId", protect, getCourseLiveClasses);
router.get("/group/:groupId", protect, getGroupLiveClasses);

module.exports = router;
