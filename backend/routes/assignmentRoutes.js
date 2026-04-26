const express = require("express");
const router = express.Router();
const { protect, authorizeTeacher } = require("../middleware/authMiddleware");
const { uploadAssignmentDoc } = require("../middleware/uploadMiddleware");
const {
  createAssignment, getCourseAssignments, getMyAssignments,
  getAssignmentById, submitAssignment, gradeSubmission,
} = require("../controllers/assignmentController");

const parseAssignmentFileIfMultipart = (req, res, next) => {
  req.body = req.body || {};
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return uploadAssignmentDoc.single("file")(req, res, (err) => {
      if (!err) return next();
      return res.status(400).json({
        message: err.message || "Invalid assignment file. Allowed: PDF, DOC, DOCX, PPT, PPTX up to 10MB",
      });
    });
  }
  return next();
};

router.get("/", protect, getMyAssignments);
router.post("/", protect, authorizeTeacher, parseAssignmentFileIfMultipart, createAssignment);
router.get("/course/:courseId", protect, getCourseAssignments);
router.get("/:id", protect, getAssignmentById);
router.post("/:id/submit", protect, (req, res, next) => {
  uploadAssignmentDoc.single("file")(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({
      message: err.message || "Invalid submission file. Allowed: PDF, DOC, DOCX, PPT, PPTX up to 10MB",
    });
  });
}, submitAssignment);
router.patch("/:assignmentId/submissions/:submissionId/grade", protect, authorizeTeacher, gradeSubmission);

module.exports = router;
