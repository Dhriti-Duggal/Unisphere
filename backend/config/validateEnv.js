/**
 * validateEnv.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates all required environment variables at startup.
 * Called ONCE at the very top of server.js (after dotenv.config()).
 *
 * If any required variable is missing or empty the process exits with a clear
 * message instead of failing silently mid-request.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const REQUIRED_VARS = [
  { key: "DATABASE_URL",            hint: "Neon PostgreSQL connection string" },
  { key: "JWT_SECRET",              hint: "Secret used to sign/verify JWTs" },
  { key: "CLOUDINARY_CLOUD_NAME",   hint: "From https://cloudinary.com/console → Dashboard" },
  { key: "CLOUDINARY_API_KEY",      hint: "From https://cloudinary.com/console → Dashboard" },
  { key: "CLOUDINARY_API_SECRET",   hint: "From https://cloudinary.com/console → Dashboard" },
];

const PLACEHOLDER_VALUES = new Set([
  "your_cloud_name",
  "your_api_key",
  "your_api_secret",
  "your_jwt_secret",
  "changeme",
  "placeholder",
]);

const validateEnv = () => {
  const missing = [];

  for (const { key, hint } of REQUIRED_VARS) {
    const val = process.env[key];
    if (!val || val.trim() === "" || PLACEHOLDER_VALUES.has(val.trim())) {
      missing.push({ key, hint });
    }
  }

  if (missing.length === 0) {
    console.log("✅  Environment variables validated successfully.");
    return;
  }

  console.error("\n❌  MISSING or INVALID environment variables detected:\n");
  missing.forEach(({ key, hint }) => {
    console.error(`   • ${key}`);
    console.error(`     Hint: ${hint}\n`);
  });
  console.error("   → Add these to your .env file and restart the server.\n");

  // Exit early so deployment fails loudly instead of silently.
  process.exit(1);
};

module.exports = validateEnv;
