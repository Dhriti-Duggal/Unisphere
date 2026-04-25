const express = require("express");
const router = express.Router();
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");
const {
  getMe, updateProfile, getAllUsers, updateUserStatus, deleteUser,
} = require("../controllers/userController");

router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.get("/", protect, authorizeAdmin, getAllUsers);
router.patch("/:id/status", protect, authorizeAdmin, updateUserStatus);
router.delete("/:id", protect, authorizeAdmin, deleteUser);

module.exports = router;
