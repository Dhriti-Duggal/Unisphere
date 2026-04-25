const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true, role: true,
        departmentId: true, department: true, studentId: true,
        year: true, group: true, teachingGroups: true,
        bio: true, phone: true, location: true, avatarUrl: true,
        onboardingComplete: true,
      },
    });
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Not authorized as admin" });
};

const authorizeTeacher = (req, res, next) => {
  if (req.user?.role === "teacher" || req.user?.role === "admin") return next();
  res.status(403).json({ message: "Not authorized as teacher" });
};

module.exports = { protect, authorizeAdmin, authorizeTeacher };
