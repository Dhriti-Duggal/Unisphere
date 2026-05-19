/**
 * errorMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised error-handling middleware for UniSphere backend.
 *
 *  1. handleMulterError  – must be placed directly after every multer-consuming
 *                          route so that Multer-specific codes (LIMIT_FILE_SIZE,
 *                          LIMIT_UNEXPECTED_FILE, etc.) produce clean 400 JSON
 *                          responses instead of bubbling as generic 500 crashes.
 *
 *  2. globalErrorHandler – the Express 4-argument error handler placed last in
 *                          server.js. Catches everything that falls through and
 *                          prevents the process from crashing on unhandled route
 *                          errors.
 *
 *  3. handleUnhandledRejections – wires up process-level safety nets for truly
 *                                 uncaught async errors.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const multer = require("multer");

// ── 1. Multer-specific error handler ─────────────────────────────────────────

/**
 * Use this INLINE in routes (as the multer error callback) so that route-level
 * multer errors are turned into clean JSON before reaching globalErrorHandler.
 *
 * Usage in a route file:
 *   router.post("/path", (req, res, next) => {
 *     uploadMiddleware.single("file")(req, res, (err) => handleMulterError(err, req, res, next));
 *   });
 */
const handleMulterError = (err, req, res, next) => {
  if (!err) return next(); // no error — continue

  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE:       "File is too large. Please upload a smaller file.",
      LIMIT_FILE_COUNT:      "Too many files uploaded at once.",
      LIMIT_UNEXPECTED_FILE: "Unexpected field name in the file upload.",
      LIMIT_PART_COUNT:      "Too many parts in the multipart request.",
      LIMIT_FIELD_KEY:       "Field name is too long.",
      LIMIT_FIELD_VALUE:     "Field value is too long.",
      LIMIT_FIELD_COUNT:     "Too many fields in the form.",
    };
    return res.status(400).json({
      message: messages[err.code] || `Upload error: ${err.message}`,
      code: err.code,
    });
  }

  // fileFilter rejection or other upload-stage errors (e.g. wrong MIME type)
  if (err && (err.message?.includes("Only") || err.message?.includes("allowed"))) {
    return res.status(400).json({ message: err.message });
  }

  // Anything else – pass down to globalErrorHandler
  return next(err);
};

// ── 2. Global Express error handler ──────────────────────────────────────────

/**
 * Must be registered last in server.js with app.use(globalErrorHandler).
 * Catches every error that was next(err)'d from routes / other middleware.
 */
const globalErrorHandler = (err, req, res, _next) => {
  // Determine HTTP status
  const status =
    err.status ||
    err.statusCode ||
    (err.name === "ValidationError" ? 400 : null) ||
    (err.name === "CastError"       ? 400 : null) ||
    (err.name === "JsonWebTokenError"  ? 401 : null) ||
    (err.name === "TokenExpiredError"  ? 401 : null) ||
    500;

  const message =
    err.expose !== false && err.message
      ? err.message
      : "Internal server error";

  // Don't leak internal details in production
  const payload = {
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
      name: err.name,
    }),
  };

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}: ${err.message}`);
  if (status === 500) console.error(err.stack);

  // Guard against trying to send a response after headers are already sent
  if (res.headersSent) return;
  res.status(status).json(payload);
};

// ── 3. Process-level safety nets ─────────────────────────────────────────────

/**
 * Call once from server.js to prevent the Node process from crashing on
 * unhandled promise rejections or uncaught exceptions.
 */
const registerProcessHandlers = () => {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("[unhandledRejection]", reason);
    // In production you may want to gracefully shut down here.
  });

  process.on("uncaughtException", (err) => {
    console.error("[uncaughtException]", err.message, err.stack);
    // Fatal — exit so process manager (PM2 / Railway) can restart cleanly.
    process.exit(1);
  });
};

module.exports = { handleMulterError, globalErrorHandler, registerProcessHandlers };
