const express = require("express");
const router = express.Router();
const { createCourse, getTeacherCourses, getCourseById } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createCourse);
router.get("/teacher", getTeacherCourses);
router.get("/:id", getCourseById);

module.exports = router;
