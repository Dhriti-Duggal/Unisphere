const express = require("express");
const router = express.Router();
const { protect, authorizeTeacher, authorizeAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  createCourse, getTeacherCourses, getStudentCourses, getEnrolledCourses,
  getCourseById, enrollCourse, getAllCourses, deleteCourse, addCourseMaterial, getCourseMaterials,
} = require("../controllers/courseController");

router.get("/all", protect, authorizeAdmin, getAllCourses);
router.get("/teacher", protect, authorizeTeacher, getTeacherCourses);
router.get("/student", protect, getStudentCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.post("/", protect, authorizeTeacher, createCourse);
router.get("/:id", protect, getCourseById);
router.get("/:id/materials", protect, getCourseMaterials);
router.post("/:id/materials", protect, authorizeTeacher, upload.single("file"), addCourseMaterial);
router.post("/:id/enroll", protect, enrollCourse);
router.delete("/:id", protect, authorizeTeacher, deleteCourse);

module.exports = router;
