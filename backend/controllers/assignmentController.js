const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res) => {
  try {
    const { title, courseId, description, dueDate, points } = req.body;
    
    const assignment = await Assignment.create({
      title,
      course: courseId,
      description,
      dueDate,
      points
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
