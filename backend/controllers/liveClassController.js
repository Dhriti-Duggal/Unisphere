const prisma = require("../lib/prisma");

// POST /api/live-classes
exports.scheduleLiveClass = async (req, res) => {
  try {
    const { title, courseId, groupId, scheduledTime, meetUrl } = req.body;
    if (!courseId && !groupId)
      return res.status(400).json({ message: "Either courseId or groupId is required" });

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        courseId: courseId || null,
        groupId: groupId || "",
        instructorId: req.user.id,
        scheduledTime: new Date(scheduledTime),
        meetUrl: meetUrl || "",
      },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        course: { select: { id: true, title: true, code: true } },
      },
    });
    res.status(201).json(liveClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/live-classes/course/:courseId
exports.getCourseLiveClasses = async (req, res) => {
  try {
    const liveClasses = await prisma.liveClass.findMany({
      where: { courseId: req.params.courseId },
      include: { instructor: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { scheduledTime: "asc" },
    });
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/live-classes/group/:groupId
exports.getGroupLiveClasses = async (req, res) => {
  try {
    const liveClasses = await prisma.liveClass.findMany({
      where: { groupId: req.params.groupId },
      include: { instructor: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { scheduledTime: "asc" },
    });
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/live-classes/upcoming — for logged-in user
exports.getUpcomingLiveClasses = async (req, res) => {
  try {
    const now = new Date();
    let where = { scheduledTime: { gte: now } };

    if (req.user.role === "teacher") {
      where.instructorId = req.user.id;
    } else if (req.user.role === "student") {
      // Get enrolled course IDs
      const enrollments = await prisma.courseStudent.findMany({
        where: { userId: req.user.id },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);
      where.OR = [
        { courseId: { in: courseIds } },
        { groupId: req.user.group || "" },
      ];
    }

    const liveClasses = await prisma.liveClass.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        course: { select: { id: true, title: true, code: true } },
      },
      orderBy: { scheduledTime: "asc" },
      take: 5,
    });
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
