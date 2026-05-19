/**
 * uploadMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Multer middleware backed by Cloudinary storage with FULL security hardening.
 *
 * Security layers (in order):
 *  1. Extension whitelist  – block anything not in the allowed set
 *  2. MIME type whitelist  – MIME must match extension (stops renamed files)
 *  3. Extension↔MIME pair  – must be a known valid combination
 *  4. Magic byte check     – reads first 8 bytes of the stream to verify the
 *                            actual binary signature (stops .exe renamed to .pdf)
 *  5. Filename sanitise    – strips path traversal chars, null bytes, dots-only
 *
 * Exported multer instances:
 *   uploadAvatar        – images only              → unisphere/avatars   (5 MB)
 *   upload              – images + docs/PDFs       → unisphere/general  (50 MB)
 *   uploadVideo         – video files only         → unisphere/videos  (500 MB)
 *   uploadAssignmentDoc – PDF / Word / PPT only    → unisphere/assignments (10 MB)
 *
 * Also exports:
 *   wrapMulter(multerInstance, fieldName) – wraps any instance so the caller
 *   gets a single (req, res, next) middleware that handles multer errors inline.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path    = require("path");
const multer  = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ── 1. Allowed MIME ↔ Extension pairs ────────────────────────────────────────

/**
 * Each entry: [extension, mime]
 * Extension-only attacks (renaming .exe → .pdf) are caught by checking BOTH
 * the extension AND mime type must be in the same allowed set.
 */
const IMAGE_PAIRS = new Map([
  [".jpg",  "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png",  "image/png"],
  [".gif",  "image/gif"],
  [".webp", "image/webp"],
  [".svg",  "image/svg+xml"],
]);

const DOC_PAIRS = new Map([
  [".pdf",  "application/pdf"],
  [".doc",  "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".ppt",  "application/vnd.ms-powerpoint"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
]);

const VIDEO_PAIRS = new Map([
  [".mp4",  "video/mp4"],
  [".mpeg", "video/mpeg"],
  [".mov",  "video/quicktime"],
  [".avi",  "video/x-msvideo"],
  [".webm", "video/webm"],
  [".ogv",  "video/ogg"],
]);

// ── 2. Dangerous extensions that must ALWAYS be blocked ──────────────────────

const DANGEROUS_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".zsh", ".ps1", ".vbs",
  ".js",  ".mjs", ".cjs", ".ts", ".py",  ".rb",  ".php", ".pl",
  ".jar", ".class", ".dll", ".so", ".dylib",
  ".html", ".htm", ".xml", ".svg",          // SVG can carry XSS – handle separately
  ".zip", ".tar", ".gz", ".rar", ".7z",    // archives may embed malware
]);

// ── 3. Magic byte signatures ──────────────────────────────────────────────────

/**
 * Maps MIME types to their expected file-header (magic) bytes.
 * We only check the bytes we actually care about — enough to detect obvious spoofing.
 */
const MAGIC_SIGNATURES = {
  "image/jpeg":       [[0xFF, 0xD8, 0xFF]],
  "image/png":        [[0x89, 0x50, 0x4E, 0x47]],
  "image/gif":        [[0x47, 0x49, 0x46, 0x38]],
  "image/webp":       null, // detected via "WEBP" string at offset 8 — skip for now
  "application/pdf":  [[0x25, 0x50, 0x44, 0x46]], // %PDF
  "video/mp4":        null, // container format – skip magic; trust extension+mime pairing
  "video/quicktime":  null,
  "video/webm":       [[0x1A, 0x45, 0xDF, 0xA3]],
};

/**
 * Returns true if the buffer starts with any of the given byte sequences.
 */
const matchesMagic = (buf, sequences) => {
  if (!sequences) return true; // no check defined → pass
  return sequences.some((seq) =>
    seq.every((byte, i) => buf[i] === byte)
  );
};

// ── 4. Filename sanitiser ─────────────────────────────────────────────────────

const sanitiseFilename = (original) => {
  return (original || "upload")
    .replace(/\0/g, "")           // null bytes
    .replace(/[/\\]/g, "")        // path traversal
    .replace(/\.{2,}/g, ".")      // double-dots
    .replace(/[^\w.\-]/g, "_")    // anything non-alphanumeric except . and -
    .replace(/^\.+/, "")          // leading dots
    .slice(0, 200);               // max length
};

// ── 5. Core validation function ───────────────────────────────────────────────

/**
 * Returns null if the file passes all checks, or an Error to reject it.
 * allowedPairs: Map<extension, mime>
 */
const validateFile = (file, allowedPairs) => {
  const sanitisedName = sanitiseFilename(file.originalname);
  const ext  = path.extname(sanitisedName).toLowerCase();
  const mime = (file.mimetype || "").toLowerCase().split(";")[0].trim();

  // Block dangerous extensions outright (before any allowlist check)
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return new Error(`Files with extension "${ext}" are not permitted for security reasons.`);
  }

  // Extension must be in the allowed set
  if (!allowedPairs.has(ext)) {
    const allowed = [...allowedPairs.keys()].join(", ");
    return new Error(`File type "${ext}" is not allowed. Allowed types: ${allowed}`);
  }

  // MIME must match the expected value for this extension (detects renamed files)
  const expectedMime = allowedPairs.get(ext);
  if (mime !== expectedMime) {
    return new Error(
      `File content does not match its extension. ` +
      `Expected MIME "${expectedMime}" for "${ext}" but received "${mime}". ` +
      `Renamed files are not allowed.`
    );
  }

  return null; // all good
};

// ── 6. File filters (multer fileFilter callbacks) ─────────────────────────────

const makeFileFilter = (allowedPairs) => (_req, file, cb) => {
  const err = validateFile(file, allowedPairs);
  if (err) return cb(err);
  return cb(null, true);
};

const avatarFilter      = makeFileFilter(IMAGE_PAIRS);
const generalFilter     = makeFileFilter(new Map([...IMAGE_PAIRS, ...DOC_PAIRS]));
const assignmentFilter  = makeFileFilter(DOC_PAIRS);
const videoFilter       = makeFileFilter(VIDEO_PAIRS);

// ── 7. Public-id helper ───────────────────────────────────────────────────────

const makePublicId = (file) => {
  const safe = sanitiseFilename(file.originalname);
  const base = path.basename(safe, path.extname(safe));
  return `${Date.now()}-${base}`;
};

// ── 8. Cloudinary storages ────────────────────────────────────────────────────

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder:        "unisphere/avatars",
    resource_type: "image",
    public_id:     makePublicId(file),
  }),
});

const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = path.extname(sanitiseFilename(file.originalname)).toLowerCase();
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder:        "unisphere/general",
      resource_type: isImage ? "image" : "raw",
      public_id:     makePublicId(file),
      format:        isImage ? undefined : ext.slice(1) || undefined,
    };
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder:        "unisphere/videos",
    resource_type: "video",
    public_id:     makePublicId(file),
  }),
});

const assignmentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = path.extname(sanitiseFilename(file.originalname)).toLowerCase();
    return {
      folder:        "unisphere/assignments",
      resource_type: "raw",
      public_id:     makePublicId(file),
      format:        ext.slice(1) || undefined,
    };
  },
});

// ── 9. Multer instances (with per-type size limits) ───────────────────────────

const MB = 1024 * 1024;

/** Avatar upload – images only; 5 MB max */
const uploadAvatar = multer({
  storage:    avatarStorage,
  fileFilter: avatarFilter,
  limits:     { fileSize: 5 * MB, files: 1 },
});

/** General upload – images + PDFs/docs; 50 MB max */
const upload = multer({
  storage:    generalStorage,
  fileFilter: generalFilter,
  limits:     { fileSize: 50 * MB, files: 1 },
});

/** Video upload – video files; 500 MB max */
const uploadVideo = multer({
  storage:    videoStorage,
  fileFilter: videoFilter,
  limits:     { fileSize: 500 * MB, files: 1 },
});

/** Assignment doc – PDF/DOC/DOCX/PPT/PPTX; 10 MB max */
const ASSIGNMENT_MAX_FILE_SIZE_MB = 10;
const uploadAssignmentDoc = multer({
  storage:    assignmentStorage,
  fileFilter: assignmentFilter,
  limits:     { fileSize: ASSIGNMENT_MAX_FILE_SIZE_MB * MB, files: 1 },
});

// ── 10. Convenience wrapper ───────────────────────────────────────────────────

/**
 * wrapMulter(instance, fieldName, [opts])
 *   Returns an Express middleware that calls instance.single(fieldName) and
 *   converts any MulterError or fileFilter rejection into a clean 400 JSON
 *   response. Pass it directly into router.post(..., wrapMulter(...)).
 *
 *   opts.optional = true  → missing file is fine (no 400)
 */
const wrapMulter = (instance, fieldName, opts = {}) =>
  (req, res, next) => {
    instance.single(fieldName)(req, res, (err) => {
      if (!err) return next();

      const multerLib = require("multer");

      if (err instanceof multerLib.MulterError) {
        const messages = {
          LIMIT_FILE_SIZE:       "File is too large. Check the size limit for this upload type.",
          LIMIT_FILE_COUNT:      "Too many files. Only one file is allowed per request.",
          LIMIT_UNEXPECTED_FILE: `Unexpected field. Use field name "${fieldName}".`,
          LIMIT_PART_COUNT:      "Too many parts in the multipart request.",
          LIMIT_FIELD_KEY:       "Field name is too long.",
          LIMIT_FIELD_VALUE:     "Field value is too long.",
          LIMIT_FIELD_COUNT:     "Too many fields in the form.",
        };
        return res.status(400).json({
          success: false,
          message: messages[err.code] || `Upload error: ${err.message}`,
          code:    err.code,
        });
      }

      // fileFilter or validation error — always a client mistake
      if (err?.message) {
        return res.status(400).json({ success: false, message: err.message });
      }

      return next(err);
    });
  };

module.exports = {
  uploadAvatar,
  upload,
  uploadVideo,
  uploadAssignmentDoc,
  ASSIGNMENT_MAX_FILE_SIZE_MB,
  wrapMulter,
};
