const prisma = require("../lib/prisma");

const getYearToken = (yearValue = "") => {
  const lower = String(yearValue).toLowerCase();
  if (lower.includes("postgraduate")) return "postgraduate";
  const digitMatch = lower.match(/\d+/);
  return digitMatch ? digitMatch[0] : lower.trim();
};

const isCourseYearMatch = (courseSemester = "", studentYear = "") => {
  const studentToken = getYearToken(studentYear);
  if (!studentToken) return true;
  const semesterLower = String(courseSemester || "").toLowerCase();
  if (!semesterLower) return true;
  if (studentToken === "postgraduate") return semesterLower.includes("postgraduate");
  return semesterLower.includes(studentToken);
};

const canStudentAccessCourse = (course, user) => {
  if (!course) return false;
  if (course.departmentId && user.departmentId && course.departmentId !== user.departmentId) return false;
  if (course.group && user.group && course.group !== user.group) return false;
  if (!isCourseYearMatch(course.semester, user.year)) return false;
  return true;
};

// POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const body = req.body || {};
    const { title, courseId, description, dueDate, points } = body;
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
    if (!canManageOwnCourse && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to create assignment for this course" });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        attachmentUrl: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "",
        attachmentName: req.file ? req.file.originalname : "",
        attachmentSize: req.file ? req.file.size : 0,
        dueDate: parsedDueDate,
        points: parsedPoints,
        courseId,
        teacherId: req.user.id,
      },
      include: { course: { select: { id: true, title: true, code: true } } },
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error("[assignments:create]", {
      message: error.message,
      body: req.body,
      hasFile: !!req.file,
      fileName: req.file?.originalname || null,
    });
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assignments/course/:courseId
exports.getCourseAssignments = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
      select: { id: true, teacherId: true, departmentId: true, group: true, semester: true },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (req.user.role === "teacher" && course.teacherId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view assignments for this course" });
    }
    if (req.user.role === "student" && !canStudentAccessCourse(course, req.user)) {
      return res.status(403).json({ message: "Assignments are not available for your cohort" });
    }

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
    console.error("[assignments:list]", { message: error.message, userId: req.user?.id, role: req.user?.role });
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assignments — all for teacher's dept courses
exports.getMyAssignments = async (req, res) => {
  try {
    const where = req.user.role === "teacher"
      ? { teacherId: req.user.id }
      : req.user.role === "student"
      ? {
          course: {
            departmentId: req.user.departmentId || "",
            ...(req.user.group ? { OR: [{ group: "" }, { group: req.user.group }] } : {}),
          },
        }
      : req.user.role === "admin"
      ? {}
      : { id: "__forbidden__" };

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true, color: true, departmentId: true, group: true, semester: true } },
        submissions: req.user.role === "student"
          ? { where: { studentId: req.user.id }, select: { status: true, grade: true } }
          : {
              select: {
                id: true,
                status: true,
                grade: true,
                studentId: true,
                submittedAt: true,
              },
            },
      },
      orderBy: { dueDate: "asc" },
    });

    const scopedAssignments = req.user.role === "student"
      ? assignments.filter((a) => canStudentAccessCourse(a.course, req.user))
      : assignments;

    res.json(scopedAssignments);
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
            departmentId: true,
            group: true,
            semester: true,
            teacherId: true,
            teacher: { select: { name: true } },
          },
        },
        submissions: {
          include: { student: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
      },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (req.user.role === "teacher" && assignment.teacherId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this assignment" });
    }
    if (req.user.role === "student" && !canStudentAccessCourse(assignment.course, req.user)) {
      return res.status(403).json({ message: "Assignment is not available for your cohort" });
    }

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
      include: { course: { select: { id: true, departmentId: true, group: true, semester: true } } },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (!canStudentAccessCourse(assignment.course, req.user)) {
      return res.status(403).json({ message: "Assignment is not available for your cohort" });
    }

    const uploadedFileUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
    if (!uploadedFileUrl) {
      return res.status(400).json({ message: "Please upload a PDF/DOC/PPT file to submit" });
    }

    const submission = await prisma.submission.upsert({
      where: { studentId_assignmentId: { studentId: req.user.id, assignmentId: req.params.id } },
      update: { fileUrl: uploadedFileUrl, status: "submitted", submittedAt: new Date() },
      create: { studentId: req.user.id, assignmentId: req.params.id, fileUrl: uploadedFileUrl },
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
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.assignmentId },
      select: { id: true, teacherId: true },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.teacherId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to grade this assignment" });
    }

    const submission = await prisma.submission.update({
      where: { id: req.params.submissionId },
      data: { grade: parseInt(grade), status: "graded" },
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
