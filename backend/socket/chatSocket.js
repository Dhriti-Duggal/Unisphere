const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const authenticateSocketUser = async (socket) => {
  const raw = socket.handshake.auth?.token || socket.handshake.headers?.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.split(" ")[1] : raw;
  if (!token) throw new Error("No auth token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      group: true,
      departmentId: true,
    },
  });
  if (!user) throw new Error("Invalid auth user");
  return user;
};

const getThreadRoom = (threadId) => `thread:${threadId}`;

const setupChatSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const user = await authenticateSocketUser(socket);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      const memberships = await prisma.chatParticipant.findMany({
        where: { userId: socket.user.id },
        select: { threadId: true },
      });
      memberships.forEach((m) => socket.join(getThreadRoom(m.threadId)));
      socket.emit("chat:ready", { threadIds: memberships.map((m) => m.threadId) });
    } catch (error) {
      socket.emit("chat:error", { message: "Failed to join chat threads" });
    }

    socket.on("chat:send", async (payload, ack) => {
      try {
        const threadId = String(payload?.threadId || "");
        const content = String(payload?.content || "").trim();
        if (!threadId || !content) {
          if (ack) ack({ ok: false, message: "threadId and content are required" });
          return;
        }

        const membership = await prisma.chatParticipant.findUnique({
          where: { threadId_userId: { threadId, userId: socket.user.id } },
          select: { id: true },
        });
        if (!membership) {
          if (ack) ack({ ok: false, message: "Not authorized for this thread" });
          return;
        }

        const message = await prisma.chatMessage.create({
          data: {
            threadId,
            senderId: socket.user.id,
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

        io.to(getThreadRoom(threadId)).emit("chat:message", message);
        if (ack) ack({ ok: true, message });
      } catch (error) {
        if (ack) ack({ ok: false, message: error.message || "Failed to send message" });
      }
    });
  });
};

module.exports = { setupChatSocket };
