const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    const ext = path.extname(safeOriginal);
    const base = path.basename(safeOriginal, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const ASSIGNMENT_ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const ASSIGNMENT_ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx"]);
const ASSIGNMENT_MAX_FILE_SIZE_MB = 10;

const assignmentFileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = file.mimetype || "";
  if (ASSIGNMENT_ALLOWED_EXTENSIONS.has(ext) && ASSIGNMENT_ALLOWED_MIME_TYPES.has(mime)) {
    return cb(null, true);
  }
  return cb(new Error("Only PDF, DOC, DOCX, PPT and PPTX files are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const uploadAssignmentDoc = multer({
  storage,
  fileFilter: assignmentFileFilter,
  limits: { fileSize: ASSIGNMENT_MAX_FILE_SIZE_MB * 1024 * 1024 },
});

module.exports = { upload, uploadAssignmentDoc, ASSIGNMENT_MAX_FILE_SIZE_MB };
