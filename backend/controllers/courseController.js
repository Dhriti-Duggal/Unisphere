const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, code, category, description, semester } = req.body;
    
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
      teacher: req.user._id,
      color: randomColor
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }).populate("students", "name email avatarUrl");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students", "name email avatarUrl");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
