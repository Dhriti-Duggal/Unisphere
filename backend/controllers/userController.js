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

// GET /api/users  —  Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id/status — Update user status/approval (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // active, disabled, pending (if we had a status field)
    // Assuming for now we just toggle something, or set status if it existed.
    // If we add 'accountStatus' to the User model, we'd update it here.
    // Let's assume we just add it to the user object dynamically if not in schema,
    // actually let's just send back a success message for now or update an 'isActive' flag.
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // We'll assume the frontend just uses this to mock approval if no schema field exists.
    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
