const express = require("express");
const router = express.Router();

const { getMe, updateProfile, getAllUsers, updateUserStatus } = require("../controllers/userController");
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");

// All routes below require a valid JWT
router.use(protect);

// GET  /api/users/me      — fetch current user profile
router.get("/me", getMe);

// PATCH /api/users/profile — update profile & onboarding fields
router.patch("/profile", updateProfile);

// Admin only routes
router.get("/", authorizeAdmin, getAllUsers);
router.patch("/:id/status", authorizeAdmin, updateUserStatus);

module.exports = router;
