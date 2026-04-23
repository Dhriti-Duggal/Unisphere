const User = require("../models/User");

// GET /api/users/me  —  Returns the current user's profile
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/profile  —  Update profile + onboarding fields
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "phone",
      "location",
      "avatarUrl",
      "departmentId",
      "department",
      "studentId",
      "year",
      "onboardingComplete",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
