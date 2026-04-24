const express = require("express");
const router = express.Router();
const { createCourse, getTeacherCourses, getCourseById, getStudentCourses, enrollCourse, getEnrolledCourses } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createCourse);
router.get("/teacher", getTeacherCourses);
router.get("/student", getStudentCourses);
router.get("/enrolled", getEnrolledCourses);
router.post("/:id/enroll", enrollCourse);
router.get("/:id", getCourseById);

module.exports = router;
