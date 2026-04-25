/**
 * UniSphere Seed Script
 * Populates Neon PostgreSQL with demo data:
 *   - 1 Admin, 3 Teachers (one per dept), 6 Students (two per dept)
 *   - 9 Courses (3 per dept), Assignments, Live Classes
 *
 * Run: npm run seed
 */

require("dotenv").config();
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const DEPARTMENTS = [
  { id: "cse", name: "Computer Science & Engineering", shortName: "CSE" },
  { id: "bba", name: "Business Administration", shortName: "BBA" },
  { id: "design", name: "Design & Creative Arts", shortName: "DESIGN" },
];

const GRADIENTS = [
  "from-blue-600 to-cyan-600",
  "from-indigo-600 to-purple-600",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-violet-600 to-indigo-600",
];

async function main() {
  console.log("🌱 Starting UniSphere seed...\n");

  // ─── Clean slate ─────────────────────────────────────────────────────────────
  await prisma.submission.deleteMany();
  await prisma.courseStudent.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data\n");

  const hash = (pw) => bcrypt.hash(pw, 10);

  // ─── Admin ───────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Admin UniSphere",
      email: "admin@unisphere.edu",
      password: await hash("Admin@123"),
      role: "admin",
      departmentId: "cse",
      department: "Computer Science & Engineering",
      onboardingComplete: true,
      bio: "Platform administrator.",
      studentId: "ADMIN-001",
    },
  });
  console.log(`👤 Admin: ${admin.email}`);

  // ─── Teachers ────────────────────────────────────────────────────────────────
  const teacherData = [
    {
      name: "Dr. Arjun Mehta",
      email: "arjun.mehta@unisphere.edu",
      dept: DEPARTMENTS[0],
      teachingGroups: ["Group 1", "Group 2"],
      year: "Associate Professor",
      studentId: "EMP-2024-0001",
      bio: "Expert in Distributed Systems and Cloud Computing with 12+ years experience.",
    },
    {
      name: "Prof. Sunita Sharma",
      email: "sunita.sharma@unisphere.edu",
      dept: DEPARTMENTS[1],
      teachingGroups: ["Group 1", "Group 3"],
      year: "Professor",
      studentId: "EMP-2024-0002",
      bio: "Strategic Management and Entrepreneurship specialist.",
    },
    {
      name: "Ms. Priya Nair",
      email: "priya.nair@unisphere.edu",
      dept: DEPARTMENTS[2],
      teachingGroups: ["Group 2", "Group 4"],
      year: "Assistant Professor",
      studentId: "EMP-2024-0003",
      bio: "UX Design and Visual Communication expert.",
    },
  ];

  const teachers = await Promise.all(
    teacherData.map((t) =>
      prisma.user.create({
        data: {
          name: t.name,
          email: t.email,
          password: bcrypt.hashSync("Teacher@123", 10),
          role: "teacher",
          departmentId: t.dept.id,
          department: t.dept.name,
          teachingGroups: t.teachingGroups,
          year: t.year,
          studentId: t.studentId,
          bio: t.bio,
          onboardingComplete: true,
        },
      })
    )
  );
  teachers.forEach((t) => console.log(`👨‍🏫 Teacher: ${t.email}`));

  // ─── Students ─────────────────────────────────────────────────────────────────
  const studentData = [
    { name: "Riya Kapoor", email: "riya.kapoor@student.edu", dept: DEPARTMENTS[0], group: "Group 1", year: "2nd Year", sid: "STU-2024-0001" },
    { name: "Aarav Singh", email: "aarav.singh@student.edu", dept: DEPARTMENTS[0], group: "Group 2", year: "3rd Year", sid: "STU-2024-0002" },
    { name: "Meera Joshi", email: "meera.joshi@student.edu", dept: DEPARTMENTS[1], group: "Group 1", year: "1st Year", sid: "STU-2024-0003" },
    { name: "Karan Patel", email: "karan.patel@student.edu", dept: DEPARTMENTS[1], group: "Group 3", year: "2nd Year", sid: "STU-2024-0004" },
    { name: "Sana Sheikh", email: "sana.sheikh@student.edu", dept: DEPARTMENTS[2], group: "Group 2", year: "1st Year", sid: "STU-2024-0005" },
    { name: "Dev Malhotra", email: "dev.malhotra@student.edu", dept: DEPARTMENTS[2], group: "Group 4", year: "3rd Year", sid: "STU-2024-0006" },
  ];

  const students = await Promise.all(
    studentData.map((s) =>
      prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          password: bcrypt.hashSync("Student@123", 10),
          role: "student",
          departmentId: s.dept.id,
          department: s.dept.name,
          group: s.group,
          year: s.year,
          studentId: s.sid,
          onboardingComplete: true,
          bio: `${s.dept.shortName} student at UniSphere.`,
        },
      })
    )
  );
  students.forEach((s) => console.log(`🎓 Student: ${s.email}`));

  // ─── Courses ──────────────────────────────────────────────────────────────────
  const courseData = [
    // CSE — Dr. Arjun
    { title: "Data Structures & Algorithms", code: "CS301", dept: "cse", group: "Group 1", category: "Core", semester: "Spring 2026", color: GRADIENTS[0], teacherIdx: 0 },
    { title: "Cloud Computing", code: "CS402", dept: "cse", group: "Group 2", category: "Elective", semester: "Spring 2026", color: GRADIENTS[1], teacherIdx: 0 },
    { title: "Machine Learning Fundamentals", code: "CS501", dept: "cse", group: "", category: "Core", semester: "Spring 2026", color: GRADIENTS[5], teacherIdx: 0 },
    // BBA — Prof. Sunita
    { title: "Strategic Management", code: "BBA301", dept: "bba", group: "Group 1", category: "Core", semester: "Spring 2026", color: GRADIENTS[2], teacherIdx: 1 },
    { title: "Entrepreneurship & Innovation", code: "BBA402", dept: "bba", group: "Group 3", category: "Elective", semester: "Spring 2026", color: GRADIENTS[3], teacherIdx: 1 },
    { title: "Financial Management", code: "BBA201", dept: "bba", group: "", category: "Core", semester: "Spring 2026", color: GRADIENTS[4], teacherIdx: 1 },
    // Design — Ms. Priya
    { title: "UI/UX Design Principles", code: "DES301", dept: "design", group: "Group 2", category: "Core", semester: "Spring 2026", color: GRADIENTS[4], teacherIdx: 2 },
    { title: "Motion Graphics & Animation", code: "DES402", dept: "design", group: "Group 4", category: "Elective", semester: "Spring 2026", color: GRADIENTS[3], teacherIdx: 2 },
    { title: "Brand Identity Design", code: "DES201", dept: "design", group: "", category: "Core", semester: "Spring 2026", color: GRADIENTS[0], teacherIdx: 2 },
  ];

  const courses = await Promise.all(
    courseData.map((c) =>
      prisma.course.create({
        data: {
          title: c.title,
          code: c.code,
          departmentId: c.dept,
          group: c.group,
          category: c.category,
          semester: c.semester,
          color: c.color,
          description: `A comprehensive course on ${c.title} for ${c.dept.toUpperCase()} students.`,
          teacherId: teachers[c.teacherIdx].id,
        },
      })
    )
  );
  courses.forEach((c) => console.log(`📚 Course: ${c.code} - ${c.title}`));

  // ─── Enroll students ──────────────────────────────────────────────────────────
  // CSE students in CSE courses that match their group or global
  const enrollments = [
    { studentIdx: 0, courseIdx: 0 }, // Riya → DS&A (Group 1) ✓
    { studentIdx: 0, courseIdx: 2 }, // Riya → ML (global) ✓
    { studentIdx: 1, courseIdx: 1 }, // Aarav → Cloud (Group 2) ✓
    { studentIdx: 1, courseIdx: 2 }, // Aarav → ML (global) ✓
    { studentIdx: 2, courseIdx: 3 }, // Meera → Strategy (Group 1) ✓
    { studentIdx: 2, courseIdx: 5 }, // Meera → Finance (global) ✓
    { studentIdx: 3, courseIdx: 4 }, // Karan → Entrepreneurship (Group 3) ✓
    { studentIdx: 3, courseIdx: 5 }, // Karan → Finance (global) ✓
    { studentIdx: 4, courseIdx: 6 }, // Sana → UI/UX (Group 2) ✓
    { studentIdx: 4, courseIdx: 8 }, // Sana → Brand (global) ✓
    { studentIdx: 5, courseIdx: 7 }, // Dev → Motion (Group 4) ✓
    { studentIdx: 5, courseIdx: 8 }, // Dev → Brand (global) ✓
  ];

  await Promise.all(
    enrollments.map(({ studentIdx, courseIdx }) =>
      prisma.courseStudent.create({
        data: { userId: students[studentIdx].id, courseId: courses[courseIdx].id },
      })
    )
  );
  console.log(`\n✅ Enrolled ${enrollments.length} student-course pairs`);

  // ─── Assignments ──────────────────────────────────────────────────────────────
  const now = new Date();
  const daysFromNow = (d) => new Date(now.getTime() + d * 86400000);

  const assignmentData = [
    { title: "Algorithm Analysis Report", courseIdx: 0, teacherIdx: 0, desc: "Analyze time & space complexity of 5 sorting algorithms.", due: daysFromNow(7), points: 100 },
    { title: "Binary Trees Lab", courseIdx: 0, teacherIdx: 0, desc: "Implement AVL and Red-Black trees.", due: daysFromNow(14), points: 80 },
    { title: "Cloud Architecture Design", courseIdx: 1, teacherIdx: 0, desc: "Design a scalable microservices architecture on AWS.", due: daysFromNow(10), points: 120 },
    { title: "Business Case Study", courseIdx: 3, teacherIdx: 1, desc: "Analyze Apple's strategic management decisions.", due: daysFromNow(5), points: 100 },
    { title: "Startup Pitch Deck", courseIdx: 4, teacherIdx: 1, desc: "Create a pitch deck for your startup idea.", due: daysFromNow(21), points: 150 },
    { title: "UI Redesign Project", courseIdx: 6, teacherIdx: 2, desc: "Redesign a popular app using Figma.", due: daysFromNow(14), points: 100 },
    { title: "Brand Identity Package", courseIdx: 8, teacherIdx: 2, desc: "Create complete brand identity for a new company.", due: daysFromNow(30), points: 200 },
  ];

  const assignments = await Promise.all(
    assignmentData.map((a) =>
      prisma.assignment.create({
        data: {
          title: a.title,
          description: a.desc,
          dueDate: a.due,
          points: a.points,
          courseId: courses[a.courseIdx].id,
          teacherId: teachers[a.teacherIdx].id,
        },
      })
    )
  );
  assignments.forEach((a) => console.log(`📋 Assignment: ${a.title}`));

  // ─── Live Classes ─────────────────────────────────────────────────────────────
  const liveData = [
    { title: "DSA Live Q&A Session", courseIdx: 0, teacherIdx: 0, time: daysFromNow(2) },
    { title: "Cloud Infrastructure Walkthrough", courseIdx: 1, teacherIdx: 0, time: daysFromNow(4) },
    { title: "ML Model Evaluation Workshop", courseIdx: 2, teacherIdx: 0, time: daysFromNow(6) },
    { title: "Strategy Frameworks Review", courseIdx: 3, teacherIdx: 1, time: daysFromNow(3) },
    { title: "Figma Advanced Session", courseIdx: 6, teacherIdx: 2, time: daysFromNow(1) },
    { title: "Brand Design Critique", courseIdx: 8, teacherIdx: 2, time: daysFromNow(8) },
  ];

  await Promise.all(
    liveData.map((l) =>
      prisma.liveClass.create({
        data: {
          title: l.title,
          courseId: courses[l.courseIdx].id,
          instructorId: teachers[l.teacherIdx].id,
          scheduledTime: l.time,
          meetUrl: `https://meet.unisphere.edu/${courses[l.courseIdx].code.toLowerCase()}`,
        },
      })
    )
  );
  console.log(`\n✅ Created ${liveData.length} live class sessions`);

  console.log(`
╔══════════════════════════════════════════════════════╗
║           🎓 UniSphere Seed Complete!               ║
╠══════════════════════════════════════════════════════╣
║  Admin    → admin@unisphere.edu      / Admin@123    ║
║  Teacher  → arjun.mehta@unisphere.edu / Teacher@123 ║
║  Teacher  → sunita.sharma@unisphere.edu             ║
║  Teacher  → priya.nair@unisphere.edu                ║
║  Student  → riya.kapoor@student.edu  / Student@123  ║
║  Student  → aarav.singh@student.edu                 ║
║  ...and 4 more students                             ║
╚══════════════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
