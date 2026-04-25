const express = require("express");
const router = express.Router();
const { protect, authorizeTeacher } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  createAssignment, getCourseAssignments, getMyAssignments,
  getAssignmentById, submitAssignment, gradeSubmission,
} = require("../controllers/assignmentController");

router.get("/", protect, getMyAssignments);
router.post("/", protect, authorizeTeacher, createAssignment);
router.get("/course/:courseId", protect, getCourseAssignments);
router.get("/:id", protect, getAssignmentById);
router.post("/:id/submit", protect, upload.single("file"), submitAssignment);
router.patch("/:assignmentId/submissions/:submissionId/grade", protect, authorizeTeacher, gradeSubmission);

module.exports = router;
