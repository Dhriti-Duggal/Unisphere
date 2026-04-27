const prisma = require("../lib/prisma");

const syncGroupMembershipForUser = async (user) => {
  if (!user?.id) return;

  const courseWhere =
    user.role === "teacher"
      ? { teacherId: user.id }
      : user.role === "student"
      ? { students: { some: { userId: user.id } } }
      : null;

  if (!courseWhere) return;

  const courses = await prisma.course.findMany({
    where: courseWhere,
    select: { id: true, teacherId: true, students: { select: { userId: true } } },
  });

  if (!courses.length) return;

  const courseIds = courses.map((course) => course.id);
  const groupThreads = await prisma.chatThread.findMany({
    where: { type: "group", courseId: { in: courseIds } },
    select: { id: true, courseId: true },
  });
  if (!groupThreads.length) return;

  const existingMemberships = await prisma.chatParticipant.findMany({
    where: { userId: user.id, threadId: { in: groupThreads.map((thread) => thread.id) } },
    select: { threadId: true },
  });
  const existingThreadIds = new Set(existingMemberships.map((row) => row.threadId));

  const threadByCourseId = new Map(groupThreads.map((thread) => [thread.courseId, thread.id]));
  const missingThreadIds = courses
    .map((course) => threadByCourseId.get(course.id))
    .filter(Boolean)
    .filter((threadId) => !existingThreadIds.has(threadId));

  if (missingThreadIds.length) {
    await prisma.chatParticipant.createMany({
      data: missingThreadIds.map((threadId) => ({ threadId, userId: user.id })),
      skipDuplicates: true,
    });
  }
};

const getUserThreadIds = async (userId) => {
  const memberships = await prisma.chatParticipant.findMany({
    where: { userId },
    select: { threadId: true },
  });
  return memberships.map((m) => m.threadId);
};

const canUserAccessThread = async (threadId, userId) => {
  const membership = await prisma.chatParticipant.findUnique({
    where: { threadId_userId: { threadId, userId } },
    select: { id: true },
  });
  return !!membership;
};

// GET /api/chat/threads
exports.getMyThreads = async (req, res) => {
  try {
    await syncGroupMembershipForUser(req.user);

    const threadIds = await getUserThreadIds(req.user.id);
    if (!threadIds.length) return res.json([]);

    const threads = await prisma.chatThread.findMany({
      where: { id: { in: threadIds } },
      include: {
        course: { select: { id: true, title: true, code: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true, role: true, group: true } } },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, name: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const unreadCounts = await Promise.all(
      threads.map(async (thread) => {
        const membership = await prisma.chatParticipant.findUnique({
          where: { threadId_userId: { threadId: thread.id, userId: req.user.id } },
          select: { lastReadAt: true },
        });
        const unreadCount = await prisma.chatMessage.count({
          where: {
            threadId: thread.id,
            senderId: { not: req.user.id },
            createdAt: { gt: membership?.lastReadAt || new Date(0) },
          },
        });
        return { threadId: thread.id, unreadCount };
      })
    );

    const unreadMap = new Map(unreadCounts.map((row) => [row.threadId, row.unreadCount]));
    res.json(
      threads.map((thread) => ({
        ...thread,
        unreadCount: unreadMap.get(thread.id) || 0,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/threads/:id/messages
exports.getThreadMessages = async (req, res) => {
  try {
    const threadId = req.params.id;
    const hasAccess = await canUserAccessThread(threadId, req.user.id);
    if (!hasAccess) return res.status(403).json({ message: "Not authorized for this chat thread" });

    const messages = await prisma.chatMessage.findMany({
      where: { threadId },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 500,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/threads/group
// body: { courseId }
exports.getOrCreateCourseGroupThread = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only teachers can create course group chats" });
    }
    const { courseId } = req.body || {};
    if (!courseId) return res.status(400).json({ message: "courseId is required" });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        students: { select: { userId: true } },
      },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (req.user.role !== "admin" && course.teacherId !== req.user.id) {
      return res.status(403).json({ message: "Only the course teacher can manage this group chat" });
    }

    let thread = await prisma.chatThread.findFirst({
      where: { type: "group", courseId },
    });

    const participantIds = Array.from(new Set([course.teacherId, ...course.students.map((s) => s.userId)]));

    if (!thread) {
      thread = await prisma.chatThread.create({
        data: {
          type: "group",
          title: `${course.code || "COURSE"} Group`,
          courseId,
          createdById: req.user.id,
          participants: {
            create: participantIds.map((userId) => ({ userId })),
          },
        },
      });
    } else {
      // Keep participants synced with enrollments.
      const existingParticipants = await prisma.chatParticipant.findMany({
        where: { threadId: thread.id },
        select: { userId: true },
      });
      const existingIds = new Set(existingParticipants.map((p) => p.userId));
      const missing = participantIds.filter((id) => !existingIds.has(id));
      if (missing.length > 0) {
        await prisma.chatParticipant.createMany({
          data: missing.map((userId) => ({ threadId: thread.id, userId })),
          skipDuplicates: true,
        });
      }
    }

    const fullThread = await prisma.chatThread.findUnique({
      where: { id: thread.id },
      include: {
        course: { select: { id: true, title: true, code: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true, role: true, group: true } } },
        },
      },
    });

    res.json(fullThread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/threads/direct
// teacher: { studentId }, student: { teacherId? }
exports.getOrCreateDirectThread = async (req, res) => {
  try {
    const { studentId, teacherId } = req.body || {};

    const targetStudentId = req.user.role === "teacher" ? studentId : req.user.id;
    const targetTeacherId = req.user.role === "teacher" ? req.user.id : teacherId;

    if (!targetStudentId || !targetTeacherId) {
      return res.status(400).json({ message: "teacherId and studentId are required for direct chat" });
    }

    const teacher = await prisma.user.findUnique({ where: { id: targetTeacherId }, select: { id: true, role: true } });
    const student = await prisma.user.findUnique({ where: { id: targetStudentId }, select: { id: true, role: true } });
    if (!teacher || teacher.role !== "teacher") return res.status(400).json({ message: "Invalid teacherId" });
    if (!student || student.role !== "student") return res.status(400).json({ message: "Invalid studentId" });

    // Students can only DM teachers and only for shared courses.
    if (req.user.role === "student" && req.user.id !== targetStudentId) {
      return res.status(403).json({ message: "Students can only open their own direct chats" });
    }

    const sharedCourse = await prisma.course.findFirst({
      where: {
        teacherId: targetTeacherId,
        students: { some: { userId: targetStudentId } },
      },
      select: { id: true },
    });
    if (!sharedCourse) {
      return res.status(403).json({ message: "Teacher and student do not share an enrolled course" });
    }

    const candidateThreads = await prisma.chatThread.findMany({
      where: {
        type: "direct",
        participants: {
          some: { userId: targetTeacherId },
        },
        AND: [
          {
            participants: {
              some: { userId: targetStudentId },
            },
          },
        ],
      },
      include: { participants: true },
      take: 20,
    });
    const existing = candidateThreads.find((thread) => {
      const ids = thread.participants.map((p) => p.userId);
      return ids.length === 2 && ids.includes(targetTeacherId) && ids.includes(targetStudentId);
    });

    let thread = existing;
    if (!thread) {
      thread = await prisma.chatThread.create({
        data: {
          type: "direct",
          title: "",
          createdById: req.user.id,
          participants: {
            create: [{ userId: targetTeacherId }, { userId: targetStudentId }],
          },
        },
      });
    }

    const fullThread = await prisma.chatThread.findUnique({
      where: { id: thread.id },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, email: true, role: true, group: true } } },
        },
      },
    });
    res.json(fullThread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/threads/:id/messages
exports.postMessage = async (req, res) => {
  try {
    const threadId = req.params.id;
    const content = String(req.body?.content || "").trim();
    if (!content) return res.status(400).json({ message: "Message content is required" });

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: { participants: true },
    });
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    if (!thread.participants.some((p) => p.userId === req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this thread" });
    }

    const message = await prisma.chatMessage.create({
      data: {
        threadId,
        senderId: req.user.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/chat/threads/:id/read
exports.markThreadAsRead = async (req, res) => {
  try {
    const threadId = req.params.id;
    const membership = await prisma.chatParticipant.findUnique({
      where: { threadId_userId: { threadId, userId: req.user.id } },
      select: { id: true },
    });
    if (!membership) return res.status(403).json({ message: "Not authorized for this chat thread" });

    await prisma.chatParticipant.update({
      where: { threadId_userId: { threadId, userId: req.user.id } },
      data: { lastReadAt: new Date() },
    });

    return res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
