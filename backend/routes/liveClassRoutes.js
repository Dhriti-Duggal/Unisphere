const express = require("express");
const router = express.Router();
const { scheduleLiveClass, getCourseLiveClasses, getGroupLiveClasses } = require("../controllers/liveClassController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", scheduleLiveClass);
router.get("/course/:courseId", getCourseLiveClasses);
router.get("/group/:groupId", getGroupLiveClasses);

module.exports = router;
