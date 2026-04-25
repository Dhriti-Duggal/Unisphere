const prisma = require("../lib/prisma");

// POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const { title, courseId, description, dueDate, points } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description: description || "",
        dueDate: new Date(dueDate),
        points: points || 100,
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
        course: { select: { id: true, title: true, code: true } },
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
    const { fileUrl } = req.body;
    const submission = await prisma.submission.upsert({
      where: { studentId_assignmentId: { studentId: req.user.id, assignmentId: req.params.id } },
      update: { fileUrl: fileUrl || "", status: "submitted", submittedAt: new Date() },
      create: { studentId: req.user.id, assignmentId: req.params.id, fileUrl: fileUrl || "" },
    });
    res.json(submission);
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
