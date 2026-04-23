const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Explicitly allow all origins, the Authorization header, and PATCH requests
// so the browser preflight (OPTIONS) succeeds instead of returning 403.
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// Handle OPTIONS preflight for every route BEFORE route handlers
// Express 5 requires a regex for wildcard — string "*" causes a PathError
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});