const prisma = require("../lib/prisma");
const { deleteCloudinaryAsset } = require("../lib/cloudinaryHelper");

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
      "role",
    ];
    const data = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    if (data.role) {
      const validRoles = ["student", "teacher", "admin"];
      if (!validRoles.includes(data.role)) {
        return res.status(400).json({ message: "Invalid role value" });
      }
    }

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

    // Debug visibility for Neon DB writes during onboarding/profile updates.
    if (Object.keys(data).length > 0) {
      console.log("[profile:update]", {
        userId: req.user.id,
        changedFields: Object.keys(data),
        role: user.role,
        departmentId: user.departmentId,
        department: user.department,
        group: user.group,
        year: user.year,
        studentId: user.studentId,
        onboardingComplete: user.onboardingComplete,
      });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/avatar — upload avatar image to Cloudinary
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided. Use field name 'avatar'." });
    }

    // ── Delete old avatar from Cloudinary first to prevent storage leaks ──────
    const existing = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: { avatarPublicId: true },
    });
    if (existing?.avatarPublicId) {
      await deleteCloudinaryAsset(existing.avatarPublicId, "image");
    }

    // multer-storage-cloudinary sets:
    //   req.file.path     = Cloudinary secure_url
    //   req.file.filename = Cloudinary public_id
    const avatarUrl      = req.file.path;
    const avatarPublicId = req.file.filename;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { avatarUrl, avatarPublicId },
      select: {
        id: true, name: true, email: true, role: true,
        avatarUrl: true,
      },
    });

    res.json({ message: "Avatar uploaded successfully", avatarUrl: user.avatarUrl, user });
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
      data:  role ? { role } : {},
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
    // Gather all Cloudinary assets owned by this user
    const [user, submissions] = await Promise.all([
      prisma.user.findUnique({
        where:  { id: req.params.id },
        select: { avatarPublicId: true },
      }),
      // All submission files this user uploaded
      prisma.submission.findMany({
        where:  { studentId: req.params.id },
        select: { filePublicId: true },
      }),
    ]);

    // ── Delete avatar from Cloudinary ─────────────────────────────────────────
    if (user?.avatarPublicId) {
      await deleteCloudinaryAsset(user.avatarPublicId, "image");
    }

    // ── Delete all submission files from Cloudinary ───────────────────────────
    await Promise.all(
      submissions
        .filter((s) => s.filePublicId)
        .map((s) => deleteCloudinaryAsset(s.filePublicId, "raw"))
    );

    const totalCleaned = submissions.filter((s) => s.filePublicId).length + (user?.avatarPublicId ? 1 : 0);
    console.log(`[users:delete] userId=${req.params.id} cleanedAssets=${totalCleaned}`);

    // Prisma cascade handles: Submission, CourseStudent, ChatParticipant rows
    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({ message: "User deleted", cleanedCloudinaryAssets: totalCleaned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

