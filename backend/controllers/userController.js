const prisma = require("../lib/prisma");

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        departmentId: true, department: true, studentId: true,
        year: true, group: true, teachingGroups: true,
        bio: true, phone: true, university: true, city: true, state: true,
        location: true, avatarUrl: true,
        onboardingComplete: true, createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name", "bio", "phone", "location", "avatarUrl",
      "departmentId", "department", "studentId", "year",
      "group", "teachingGroups", "onboardingComplete",
      "university", "city", "state",
    ];
    const data = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true, name: true, email: true, role: true,
        departmentId: true, department: true, studentId: true,
        year: true, group: true, teachingGroups: true,
        bio: true, phone: true, university: true, city: true, state: true,
        location: true, avatarUrl: true,
        onboardingComplete: true,
      },
    });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users — Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        departmentId: true, department: true, onboardingComplete: true,
        createdAt: true, avatarUrl: true, group: true, teachingGroups: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id/status — Admin only
exports.updateUserStatus = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: role ? { role } : {},
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ message: `User updated`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id — Admin only
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
