const express = require("express");
const router = express.Router();
const { createAssignment, getCourseAssignments } = require("../controllers/assignmentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createAssignment);
router.get("/course/:courseId", getCourseAssignments);

module.exports = router;
