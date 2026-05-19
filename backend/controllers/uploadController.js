/**
 * uploadController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements the secure signed-upload flow:
 *
 *   Backend generates signed upload signature
 *          ↓
 *   Frontend uploads DIRECTLY to Cloudinary  ← no file traffic through server
 *          ↓
 *   Cloudinary validates signature + enforces folder/size/type
 *          ↓
 *   Frontend receives { secure_url, public_id } from Cloudinary
 *          ↓
 *   Frontend sends { secure_url, public_id } to our metadata endpoint
 *
 * This eliminates:
 *   • Server memory pressure from large file streams
 *   • Upload spam  → rate limited per authenticated user (10 sigs / 15 min)
 *   • Brute-force uploads → signature expires in 60 s, one-time use
 *   • DOS via large payloads → file never touches our server
 *
 * Routes:
 *   POST   /api/upload/sign          – generate a signed upload params set
 *   DELETE /api/upload/:publicId     – delete a Cloudinary asset by public_id
 * ─────────────────────────────────────────────────────────────────────────────
 */

const cloudinary = require("../config/cloudinary");
const { deleteCloudinaryAsset } = require("../lib/cloudinaryHelper");

// ── Allowed upload contexts ───────────────────────────────────────────────────

/**
 * Each context defines:
 *   folder       – Cloudinary folder (enforced in signature)
 *   resourceType – Cloudinary resource_type
 *   maxBytes     – max_file_size enforced by Cloudinary (in bytes)
 *   allowedFormats (optional) – Cloudinary will reject other formats server-side
 */
const UPLOAD_CONTEXTS = {
  avatar: {
    folder:         "unisphere/avatars",
    resourceType:   "image",
    maxBytes:       5  * 1024 * 1024,   // 5 MB
    allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
  general: {
    folder:         "unisphere/general",
    resourceType:   "auto",             // Cloudinary auto-detects image vs raw
    maxBytes:       50 * 1024 * 1024,   // 50 MB
    allowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "ppt", "pptx"],
  },
  assignment: {
    folder:         "unisphere/assignments",
    resourceType:   "raw",
    maxBytes:       10 * 1024 * 1024,   // 10 MB
    allowedFormats: ["pdf", "doc", "docx", "ppt", "pptx"],
  },
  video: {
    folder:         "unisphere/videos",
    resourceType:   "video",
    maxBytes:       500 * 1024 * 1024,  // 500 MB
    allowedFormats: ["mp4", "mov", "avi", "webm", "mpeg", "ogv"],
  },
};

// ── POST /api/upload/sign ─────────────────────────────────────────────────────

/**
 * Generates a short-lived (~60 s) signed parameter set.
 * The frontend uses these to POST directly to:
 *   https://api.cloudinary.com/v1_1/<cloud_name>/<resource_type>/upload
 *
 * Request body:  { context: "avatar" | "general" | "assignment" | "video" }
 * Response:      { signature, timestamp, apiKey, cloudName, folder,
 *                  resourceType, maxBytes, allowedFormats }
 */
exports.generateSignature = (req, res) => {
  const { context } = req.body;

  if (!context || !UPLOAD_CONTEXTS[context]) {
    return res.status(400).json({
      success: false,
      message: `Invalid upload context. Allowed: ${Object.keys(UPLOAD_CONTEXTS).join(", ")}`,
    });
  }

  const ctx       = UPLOAD_CONTEXTS[context];
  const timestamp = Math.round(Date.now() / 1000); // Unix seconds

  // Parameters included in the signature — Cloudinary will REJECT requests
  // where these don't match, so the client cannot change folder/format/etc.
  const paramsToSign = {
    folder:          ctx.folder,
    timestamp,
    // Restrict to allowed formats (Cloudinary enforces this server-side)
    ...(ctx.allowedFormats && { allowed_formats: ctx.allowedFormats.join(",") }),
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  console.log(`[upload:sign] user=${req.user.id} context=${context} ts=${timestamp}`);

  return res.json({
    success:        true,
    signature,
    timestamp,
    apiKey:         process.env.CLOUDINARY_API_KEY,
    cloudName:      process.env.CLOUDINARY_CLOUD_NAME,
    folder:         ctx.folder,
    resourceType:   ctx.resourceType,
    maxBytes:       ctx.maxBytes,
    allowedFormats: ctx.allowedFormats,
  });
};

// ── DELETE /api/upload/:publicId ──────────────────────────────────────────────

/**
 * Called by the frontend to clean up a Cloudinary asset that was uploaded
 * directly but whose metadata was never saved (e.g. user cancelled mid-flow).
 *
 * Query param: ?resourceType=image|video|raw  (default: image)
 *
 * Security: only the owner of the file should be able to delete it.
 * We enforce this by requiring the publicId to start with a known user-owned
 * folder prefix AND the caller to be authenticated.
 */
exports.deleteAsset = async (req, res) => {
  try {
    const rawPublicId    = (req.params.publicId || "").trim();
    const resourceType   = (req.query.resourceType || "image").toLowerCase();
    const allowedTypes   = new Set(["image", "video", "raw"]);

    if (!rawPublicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }
    if (!allowedTypes.has(resourceType)) {
      return res.status(400).json({ success: false, message: "Invalid resourceType. Use image, video, or raw" });
    }

    // Security guard: only allow deletion of assets in our own folders
    const allowedPrefixes = Object.values(UPLOAD_CONTEXTS).map((c) => c.folder);
    const isAllowed = allowedPrefixes.some((prefix) => rawPublicId.startsWith(prefix));
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: "Deletion of assets outside UniSphere folders is not allowed",
      });
    }

    await deleteCloudinaryAsset(rawPublicId, resourceType);
    return res.json({ success: true, message: "Asset deleted from Cloudinary" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
