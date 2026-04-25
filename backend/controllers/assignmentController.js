const prisma = require("../lib/prisma");

// POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const { title, courseId, description, dueDate, points } = req.body;
    if (!title || !courseId || !dueDate) {
      return res.status(400).json({ message: "Title, course and due date are required" });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: "Assignment description/instructions are required" });
    }
    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: "Invalid due date" });
    }
    if (parsedDueDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }
    const parsedPoints = Number(points || 100);
    if (!Number.isFinite(parsedPoints) || parsedPoints < 1) {
      return res.status(400).json({ message: "Points must be at least 1" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true, departmentId: true, group: true },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    const canManageOwnCourse = course.teacherId === req.user.id;
    const canManageDepartmentCourse = !!req.user.departmentId && course.departmentId === req.user.departmentId;
    const canManageByGroup =
      Array.isArray(req.user.teachingGroups) &&
      req.user.teachingGroups.length > 0 &&
      !!course.group &&
      req.user.teachingGroups.includes(course.group);

    if (!canManageOwnCourse && !canManageDepartmentCourse && !canManageByGroup) {
      return res.status(403).json({ message: "Not authorized to create assignment for this course" });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        dueDate: parsedDueDate,
        points: parsedPoints,
        courseId,
        teacherId: req.user.id,
      },
      include: { course: { select: { id: true, title: true, code: true } } },
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assignments/course/:courseId
exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { courseId: req.params.courseId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            _count: { select: { students: true } },
          },
        },
        submissions: { select: { id: true, status: true, grade: true, studentId: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assignments — all for teacher's dept courses
exports.getMyAssignments = async (req, res) => {
  try {
    const where = req.user.role === "teacher"
      ? { teacherId: req.user.id }
      : {
          course: {
            students: { some: { userId: req.user.id } }
          }
        };

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true, color: true } },
        submissions: req.user.role === "student"
          ? { where: { studentId: req.user.id }, select: { status: true, grade: true } }
          : { select: { id: true, status: true, grade: true, studentId: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assignments/:id
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            teacher: { select: { name: true } },
          },
        },
        submissions: {
          include: { student: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
      },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/assignments/:id/submit
exports.submitAssignment = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit assignments" });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id },
      include: { course: { select: { id: true, departmentId: true, group: true } } },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const linkUrl = (req.body.linkUrl || "").trim();
    const uploadedFileUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
    const finalFileUrl = uploadedFileUrl || linkUrl;

    if (!finalFileUrl) {
      return res.status(400).json({ message: "Please upload a file or provide a submission link" });
    }

    const submission = await prisma.submission.upsert({
      where: { studentId_assignmentId: { studentId: req.user.id, assignmentId: req.params.id } },
      update: { fileUrl: finalFileUrl, status: "submitted", submittedAt: new Date() },
      create: { studentId: req.user.id, assignmentId: req.params.id, fileUrl: finalFileUrl },
    });
    res.json({ message: "Assignment submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/assignments/:assignmentId/submissions/:submissionId/grade
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade } = req.body;
    const submission = await prisma.submission.update({
      where: { id: req.params.submissionId },
      data: { grade: parseInt(grade), status: "graded" },
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
