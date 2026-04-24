const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, code, category, description, semester, group } = req.body;
    const departmentId = req.user.departmentId; // inherit from teacher
    
    // Pick a random gradient for the course card
    const gradients = [
      "from-blue-600 to-cyan-600",
      "from-indigo-600 to-purple-600",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-pink-500 to-rose-500"
    ];
    const randomColor = gradients[Math.floor(Math.random() * gradients.length)];

    const course = await Course.create({
      title,
      code,
      category,
      description,
      semester,
      group: group || "",
      teacher: req.user._id,
      departmentId,
      color: randomColor
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const departmentId = req.user.departmentId;
    let query = { departmentId };
    if (req.user.teachingGroups && req.user.teachingGroups.length > 0) {
      query.$or = [{ group: "" }, { group: { $in: req.user.teachingGroups } }];
    }
    const courses = await Course.find(query).populate("students", "name email avatarUrl");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students", "name email avatarUrl").populate("teacher", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const departmentId = req.user.departmentId;
    let query = { departmentId };
    if (req.user.group) {
      query.$or = [{ group: "" }, { group: req.user.group }];
    }
    const courses = await Course.find(query).populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id }).populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user._id;
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }
    
    res.json({ message: "Successfully enrolled in course", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
