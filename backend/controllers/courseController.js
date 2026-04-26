const prisma = require("../lib/prisma");

const GRADIENTS = [
  "from-blue-600 to-cyan-600",
  "from-indigo-600 to-purple-600",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-violet-600 to-indigo-600",
];

const randomColor = () => GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
const normalizeYearToken = (value = "") => {
  const lower = String(value).trim().toLowerCase();
  if (!lower) return "";
  if (lower.includes("postgraduate")) return "postgraduate";
  const digitMatch = lower.match(/\d+/);
  return digitMatch ? digitMatch[0] : lower;
};

const isCourseYearMatch = (courseSemester = "", userYear = "") => {
  const userToken = normalizeYearToken(userYear);
  if (!userToken) return true;
  const semesterLower = String(courseSemester || "").toLowerCase();
  if (!semesterLower) return true;
  if (userToken === "postgraduate") return semesterLower.includes("postgraduate");
  return semesterLower.includes(userToken);
};

const canStudentAccessCourse = (course, user) => {
  if (!course) return false;
  if (course.departmentId && user.departmentId && course.departmentId !== user.departmentId) return false;
  if (course.group && user.group && course.group !== user.group) return false;
  if (!isCourseYearMatch(course.semester, user.year)) return false;
  return true;
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { title, code, category, description, semester, group, studyMaterial } = req.body;
    if (!title || !code || !semester) {
      return res.status(400).json({ message: "Title, code and year/semester are required" });
    }
    if (group && Array.isArray(req.user.teachingGroups) && req.user.teachingGroups.length > 0 && !req.user.teachingGroups.includes(group)) {
      return res.status(400).json({ message: "You can only create courses for your assigned teaching groups" });
    }

    const mergedDescription = [String(description || "").trim(), String(studyMaterial || "").trim()]
      .filter(Boolean)
      .join("\n\nStudy Material:\n");

    const course = await prisma.course.create({
      data: {
        title: String(title).trim(),
        code: String(code).trim(),
        category: category || "General",
        description: mergedDescription,
        semester: String(semester || "").trim(),
        group: group || "",
        departmentId: req.user.departmentId || "",
        color: randomColor(),
        teacherId: req.user.id,
      },
      include: { teacher: { select: { id: true, name: true, email: true } } },
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/teacher — courses for logged-in teacher's department + groups
exports.getTeacherCourses = async (req, res) => {
  try {
    const where = { teacherId: req.user.id };

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
        students: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, departmentId: true, year: true, group: true } } } },
        assignments: { select: { id: true, title: true, dueDate: true, status: true } },
        studyMaterials: {
          select: { id: true, title: true, materialType: true, fileUrl: true, linkUrl: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { students: true, assignments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/student — dept courses filtered by student's group
exports.getStudentCourses = async (req, res) => {
  try {
    const { departmentId, group, year } = req.user;
    const where = { departmentId: departmentId || "" };

    if (group) {
      where.OR = [{ group: "" }, { group }];
    }

    const allCourses = await prisma.course.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        studyMaterials: {
          select: { id: true, title: true, materialType: true, fileUrl: true, linkUrl: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const courses = allCourses.filter((course) => isCourseYearMatch(course.semester, year));
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/enrolled — courses this student is enrolled in
exports.getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await prisma.courseStudent.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            teacher: { select: { id: true, name: true, email: true } },
            studyMaterials: {
              select: { id: true, title: true, materialType: true, fileUrl: true, linkUrl: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { students: true } },
          },
        },
      },
    });
    res.json(enrollments.map((e) => e.course));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
        students: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, group: true } } } },
        assignments: { orderBy: { dueDate: "asc" } },
        liveClasses: { orderBy: { scheduledTime: "asc" } },
        studyMaterials: {
          include: {
            uploadedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (req.user.role === "teacher" && course.teacherId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this course" });
    }
    if (req.user.role === "student" && !canStudentAccessCourse(course, req.user)) {
      return res.status(403).json({ message: "Course is not available for your cohort" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id/materials
exports.getCourseMaterials = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      select: { id: true, teacherId: true, departmentId: true, group: true, semester: true },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (req.user.role === "teacher" && course.teacherId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access course materials" });
    }
    if (req.user.role === "student" && !canStudentAccessCourse(course, req.user)) {
      return res.status(403).json({ message: "Materials are not available for your cohort" });
    }

    const materials = await prisma.studyMaterial.findMany({
      where: { courseId: req.params.id },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/materials
exports.addCourseMaterial = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only teachers can add course materials" });
    }
    const { title, description, linkUrl } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Material title is required" });
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      select: { id: true, teacherId: true },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (req.user.role !== "admin" && course.teacherId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add material to this course" });
    }

    const uploadedFileUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
    const safeLink = String(linkUrl || "").trim();
    if (!uploadedFileUrl && !safeLink) {
      return res.status(400).json({ message: "Upload a file or provide a link" });
    }

    const material = await prisma.studyMaterial.create({
      data: {
        title: String(title).trim(),
        description: String(description || "").trim(),
        materialType: uploadedFileUrl ? "file" : "link",
        fileUrl: uploadedFileUrl,
        linkUrl: uploadedFileUrl ? "" : safeLink,
        courseId: req.params.id,
        uploadedById: req.user.id,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll in courses" });
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      select: { id: true, departmentId: true, group: true, semester: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Keep enrollment aligned with student onboarding data.
    if (course.departmentId && req.user.departmentId && course.departmentId !== req.user.departmentId) {
      return res.status(400).json({ message: "Course is outside your department" });
    }
    if (course.group && req.user.group && course.group !== req.user.group) {
      return res.status(400).json({ message: "Course is not available for your group" });
    }
    if (!isCourseYearMatch(course.semester, req.user.year)) {
      return res.status(400).json({ message: "Course is not available for your year" });
    }

    const enrollment = await prisma.courseStudent.upsert({
      where: { userId_courseId: { userId: req.user.id, courseId: req.params.id } },
      update: {},
      create: { userId: req.user.id, courseId: req.params.id },
    });
    res.json({ message: "Successfully enrolled", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses — all courses (admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { students: true, assignments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
