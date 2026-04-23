const LiveClass = require("../models/LiveClass");

exports.scheduleLiveClass = async (req, res) => {
  try {
    const { title, courseId, groupId, scheduledTime } = req.body;
    
    // Either courseId or groupId must be provided
    if (!courseId && !groupId) {
      return res.status(400).json({ message: "Either courseId or groupId is required" });
    }

    const liveClass = await LiveClass.create({
      title,
      courseId,
      groupId,
      instructor: req.user._id,
      scheduledTime
    });

    res.status(201).json(liveClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseLiveClasses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const liveClasses = await LiveClass.find({ courseId }).populate("instructor", "name avatarUrl");
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupLiveClasses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const liveClasses = await LiveClass.find({ groupId }).populate("instructor", "name avatarUrl");
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
