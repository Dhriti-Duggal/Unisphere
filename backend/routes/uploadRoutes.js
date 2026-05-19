/**
 * uploadRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes for the signed direct-upload flow.
 *
 * POST   /api/upload/sign          → generate signed Cloudinary params
 * DELETE /api/upload/:publicId     → delete a Cloudinary asset
 *
 * Rate limits (per authenticated user IP):
 *   Sign endpoint:   10 signatures per 15 minutes   (stops upload spam)
 *   Delete endpoint: 30 deletions per 15 minutes     (stops mass delete abuse)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express   = require("express");
const router    = express.Router();
const rateLimit = require("express-rate-limit");

const { protect } = require("../middleware/authMiddleware");
const { generateSignature, deleteAsset } = require("../controllers/uploadController");

const rateLimit = require("express-rate-limit");
router.post("/upload", uploadRateLimiter, uploadController.uploadFile);

// Use the ipKeyGenerator helper for proper IPv6 handling
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  keyGenerator: rateLimit.ipKeyGenerator, // Use the helper for IPv6 safety
  message: "Too many upload requests from this IP, please try again later.",
});

// ── Rate limiters ─────────────────────────────────────────────────────────────

/**
 * Key on authenticated user ID (set by protect middleware) rather than raw IP
 * so that users behind the same NAT don't share a quota.
 * Falls back to IP if req.user is somehow not set.
 */
const userKey = (req) => req.user?.id || req.ip;

/** 10 signature requests per 15 minutes per user */
const signRateLimit = rateLimit({
  windowMs:         15 * 60 * 1000,   // 15 minutes
  max:              10,
  keyGenerator:     userKey,
  standardHeaders:  true,
  legacyHeaders:    false,
  message: {
    success: false,
    message: "Too many upload signature requests. Please wait 15 minutes before trying again.",
  },
  skipSuccessfulRequests: false,
});

/** 30 deletions per 15 minutes per user */
const deleteRateLimit = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              30,
  keyGenerator:     userKey,
  standardHeaders:  true,
  legacyHeaders:    false,
  message: {
    success: false,
    message: "Too many delete requests. Please slow down.",
  },
});

// ── Routes ────────────────────────────────────────────────────────────────────

// protect runs FIRST so that userKey can use req.user.id
router.post("/sign",          protect, signRateLimit,   generateSignature);
router.delete("/:publicId",   protect, deleteRateLimit, deleteAsset);

module.exports = router;
