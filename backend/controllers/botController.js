const prisma = require("../lib/prisma");

exports.getUserContext = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        year: true,
        group: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get unread chat threads count
    // A thread is unread if its lastMessageAt is > user's lastReadAt for that thread
    const participants = await prisma.threadParticipant.findMany({
      where: { userId },
      include: {
        thread: {
          select: { lastMessageAt: true },
        },
      },
    });
    
    const unreadChatsCount = participants.filter(
      (p) => p.thread.lastMessageAt && (!p.lastReadAt || p.thread.lastMessageAt > p.lastReadAt)
    ).length;

    // 3. Get enrolled/taught courses
    let courses = [];
    if (userRole === "student") {
      courses = await prisma.course.findMany({
        where: {
          departmentId: user.departmentId || "",
          ...(user.group ? { OR: [{ group: "" }, { group: user.group }] } : {}),
        },
        select: { id: true, title: true, code: true, semester: true },
      });
      // Further filter by year token if necessary (simplification: return all cohort courses)
    } else if (userRole === "teacher") {
      courses = await prisma.course.findMany({
        where: { teacherId: userId },
        select: { id: true, title: true, code: true },
      });
    }

    const courseIds = courses.map((c) => c.id);

    // 4. Get assignments
    let pendingAssignments = [];
    if (userRole === "student" && courseIds.length > 0) {
      const now = new Date();
      // Get all assignments for these courses
      const allAssignments = await prisma.assignment.findMany({
        where: {
          courseId: { in: courseIds },
          dueDate: { gt: now }, // only upcoming/pending
        },
        include: {
          course: { select: { title: true } },
          submissions: {
            where: { studentId: userId },
            select: { status: true },
          },
        },
        orderBy: { dueDate: "asc" },
      });

      // Filter out submitted ones
      pendingAssignments = allAssignments
        .filter((a) => a.submissions.length === 0 || a.submissions[0].status === "pending")
        .map((a) => ({
          id: a.id,
          title: a.title,
          course: a.course.title,
          dueDate: a.dueDate,
          points: a.points,
        }));
    }

    // 5. Get upcoming live classes
    const upcomingClasses = await prisma.liveClass.findMany({
      where: {
        courseId: { in: courseIds },
        startTime: { gt: new Date() },
      },
      include: {
        course: { select: { title: true } },
      },
      orderBy: { startTime: "asc" },
      take: 3,
    });

    const contextData = {
      profile: user,
      unreadChatsCount,
      courses: courses.map(c => c.title),
      pendingAssignments,
      upcomingClasses: upcomingClasses.map(c => ({
        topic: c.topic,
        course: c.course.title,
        startTime: c.startTime,
      })),
      contextSummary: `User ${user.name} is a ${user.role}. They have ${pendingAssignments.length} pending assignments and ${unreadChatsCount} unread chats. They are in ${courses.length} courses.`
    };

    // Push live data to Botpress Table asynchronously (fire-and-forget)
    const { syncUserContextToBotpress } = require("../lib/botpressClient");
    syncUserContextToBotpress(userId, contextData);

    res.json({
      success: true,
      ...contextData
    });
  } catch (error) {
    console.error("[botController:context]", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
