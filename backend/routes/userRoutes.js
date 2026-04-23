const express = require("express");
const router = express.Router();

const { getMe, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes below require a valid JWT
router.use(protect);

// GET  /api/users/me      — fetch current user profile
router.get("/me", getMe);

// PATCH /api/users/profile — update profile & onboarding fields
router.patch("/profile", updateProfile);

module.exports = router;
