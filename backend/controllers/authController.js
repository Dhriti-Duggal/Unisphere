const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const trimmedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password.trim(), 10);

    const selectedRole = ["student", "teacher", "admin"].includes(role) ? role : "student";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: trimmedEmail,
        password: hashed,
        role: selectedRole,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        department: user.department,
        group: user.group,
        teachingGroups: user.teachingGroups,
        onboardingComplete: user.onboardingComplete,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        university: user.university,
        city: user.city,
        state: user.state,
        location: user.location,
        studentId: user.studentId,
        year: user.year,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });

    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        department: user.department,
        group: user.group,
        teachingGroups: user.teachingGroups,
        onboardingComplete: user.onboardingComplete,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        university: user.university,
        city: user.city,
        state: user.state,
        location: user.location,
        studentId: user.studentId,
        year: user.year,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};