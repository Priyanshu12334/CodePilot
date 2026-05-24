// ─────────────────────────────────────────────────────────
//  routes/reviewRoutes.js  –  Defines all /api/review routes
// ─────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// Import the controller that contains the business logic
const { reviewCode, fixCode } = require("../controllers/reviewController");

// POST /api/review
// Accepts { code, language } → returns AI review
router.post("/review", reviewCode);

// POST /api/fix
// Accepts { code, language } → returns AI-fixed code
router.post("/fix", fixCode);

module.exports = router;
