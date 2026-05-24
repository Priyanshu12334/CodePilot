require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import the review router (handles /api/review)
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// ── CORS ──────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://code-pilot-vert.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);


// ── Body Parser ───────────────────────────────────────────
// Parse incoming JSON request bodies (req.body)
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
// Mount all /api/review endpoints
app.use("/api", reviewRoutes);

// ── Health Check ──────────────────────────────────────────
// Simple GET / endpoint so you can verify the server is up
// (useful for Render health checks)
app.get("/", (req, res) => {
  res.json({ message: "CodePilot AI Code Reviewer Backend is running" });
});

// ── 404 Handler ───────────────────────────────────────────
// Catch-all for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────
// Express calls this middleware whenever next(err) is called
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start Server ──────────────────────────────────────────
// Use PORT from .env (Render injects this automatically)
// Fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
