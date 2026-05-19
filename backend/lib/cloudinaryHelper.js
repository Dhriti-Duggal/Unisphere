/**
 * cloudinaryHelper.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility functions for safe Cloudinary asset management.
 *
 * Key principle: always delete the OLD asset from Cloudinary before (or after)
 * replacing it, so we never accumulate orphaned files.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const cloudinary = require("../config/cloudinary");

/**
 * deleteCloudinaryAsset(publicId, resourceType)
 *
 * Deletes a Cloudinary asset by its public_id.
 * Silently swallows "not found" errors (idempotent).
 *
 * @param {string} publicId       – Cloudinary public_id (stored in DB)
 * @param {"image"|"video"|"raw"} resourceType – must match how it was uploaded
 * @returns {Promise<void>}
 */
const deleteCloudinaryAsset = async (publicId, resourceType = "image") => {
  if (!publicId || publicId.trim() === "") return; // nothing to delete

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate:    true,   // purge from CDN cache too
    });

    if (result.result === "ok") {
      console.log(`[Cloudinary] Deleted ${resourceType} "${publicId}"`);
    } else if (result.result === "not found") {
      // Already gone — not an error
      console.warn(`[Cloudinary] Asset not found (already deleted?): "${publicId}"`);
    } else {
      console.warn(`[Cloudinary] Unexpected delete result for "${publicId}":`, result);
    }
  } catch (err) {
    // Log but don't throw — a failed delete should not block the user's request.
    console.error(`[Cloudinary] Failed to delete "${publicId}":`, err.message);
  }
};

/**
 * resolveResourceType(mimeType)
 * Returns the Cloudinary resource_type string for a given MIME type.
 * Falls back to "raw" for anything unrecognised.
 */
const resolveResourceType = (mimeType = "") => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) return "video";
  return "raw";
};

module.exports = { deleteCloudinaryAsset, resolveResourceType };
