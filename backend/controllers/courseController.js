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

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { title, code, category, description, semester, group } = req.body;
    const course = await prisma.course.create({
      data: {
        title, code,
        category: category || "General",
        description: description || "",
        semester: semester || "",
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
    const { departmentId, teachingGroups } = req.user;
    const where = { departmentId: departmentId || "" };

    if (teachingGroups && teachingGroups.length > 0) {
      where.OR = [{ group: "" }, { group: { in: teachingGroups } }];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
        students: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, departmentId: true, year: true, group: true } } } },
        assignments: { select: { id: true, title: true, dueDate: true, status: true } },
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
    const { departmentId, group } = req.user;
    const where = { departmentId: departmentId || "" };

    if (group) {
      where.OR = [{ group: "" }, { group }];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: "desc" },
    });
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
      },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
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
