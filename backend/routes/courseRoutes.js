const express = require("express");
const router  = express.Router();
const { protect, authorizeTeacher, authorizeAdmin } = require("../middleware/authMiddleware");
const { upload, uploadVideo, wrapMulter } = require("../middleware/uploadMiddleware");
const {
  createCourse, getTeacherCourses, getStudentCourses, getEnrolledCourses,
  getCourseById, enrollCourse, getAllCourses, deleteCourse,
  addCourseMaterial, getCourseMaterials,
} = require("../controllers/courseController");

// ── Per-type upload wrappers ──────────────────────────────────────────────────
// General: images + PDFs/docs up to 50 MB
const parseGeneralFile = wrapMulter(upload, "file");
// Video: MP4/MOV/AVI/WebM up to 500 MB
const parseVideoFile   = wrapMulter(uploadVideo, "file");

router.get("/all",      protect, authorizeAdmin,   getAllCourses);
router.get("/teacher",  protect, authorizeTeacher, getTeacherCourses);
router.get("/student",  protect, getStudentCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.post("/",        protect, authorizeTeacher, createCourse);

router.get("/:id",          protect, getCourseById);
router.get("/:id/materials", protect, getCourseMaterials);

// General file / PDF / image material upload (50 MB)
router.post("/:id/materials",       protect, authorizeTeacher, parseGeneralFile, addCourseMaterial);
// Video material upload (500 MB) — stored as Cloudinary video resource
router.post("/:id/materials/video", protect, authorizeTeacher, parseVideoFile,   addCourseMaterial);

router.post("/:id/enroll", protect, enrollCourse);
router.delete("/:id",      protect, authorizeTeacher, deleteCourse);

module.exports = router;
