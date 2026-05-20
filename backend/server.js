const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const validateEnv = require("./config/validateEnv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const liveClassRoutes = require("./routes/liveClassRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { setupChatSocket } = require("./socket/chatSocket");
const { globalErrorHandler, registerProcessHandlers } = require("./middleware/errorMiddleware");


// Validate environment variables
validateEnv(); // exits process with a clear message if any required variable is missing

// ── Process-level safety nets (unhandledRejection / uncaughtException) ────────
registerProcessHandlers();

const app = express();
const httpServer = http.createServer(app);

// ── CORS Configuration ────────────────────────────────────────────────────────
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/live-classes", liveClassRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);


// Health check route
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", db: "Neon PostgreSQL", timestamp: new Date().toISOString() })
);

// 404 fallback for undefined routes
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── Socket.io Configuration ───────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: false,
  },
});
setupChatSocket(io);

// ── Start the Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () =>
  console.log(`🚀 UniSphere backend running on port ${PORT} → Neon PostgreSQL`)
);