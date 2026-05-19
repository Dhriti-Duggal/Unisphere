const express = require("express");
const router  = express.Router();
const { protect, authorizeTeacher } = require("../middleware/authMiddleware");
const { uploadAssignmentDoc, wrapMulter } = require("../middleware/uploadMiddleware");
const {
  createAssignment, getCourseAssignments, getMyAssignments,
  getAssignmentById, submitAssignment, gradeSubmission, deleteAssignment,
} = require("../controllers/assignmentController");

// ── Inline multer wrapper for assignment documents (10 MB, PDF/DOC/PPT only) ─
const parseAssignmentFile = wrapMulter(uploadAssignmentDoc, "file");

router.get("/",                  protect, getMyAssignments);
router.post("/",                 protect, authorizeTeacher, parseAssignmentFile, createAssignment);
router.get("/course/:courseId",  protect, getCourseAssignments);
router.get("/:id",               protect, getAssignmentById);
router.post("/:id/submit",       protect, parseAssignmentFile, submitAssignment);
router.patch(
  "/:assignmentId/submissions/:submissionId/grade",
  protect, authorizeTeacher, gradeSubmission
);
// Deletes attachment + all submission files from Cloudinary, then DB record
router.delete("/:id",            protect, authorizeTeacher, deleteAssignment);

module.exports = router;

