const express = require("express");
const router  = express.Router();
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");
const { uploadAvatar, wrapMulter } = require("../middleware/uploadMiddleware");
const {
  getMe, updateProfile, uploadAvatar: uploadAvatarCtrl,
  getAllUsers, updateUserStatus, deleteUser,
} = require("../controllers/userController");

router.get("/me",      protect, getMe);
router.patch("/profile", protect, updateProfile);

// Avatar upload — 5 MB image, multer errors handled inline by wrapMulter
router.patch(
  "/avatar",
  protect,
  wrapMulter(uploadAvatar, "avatar"),
  uploadAvatarCtrl
);

router.get("/",           protect, authorizeAdmin, getAllUsers);
router.patch("/:id/status", protect, authorizeAdmin, updateUserStatus);
router.delete("/:id",     protect, authorizeAdmin, deleteUser);

module.exports = router;
