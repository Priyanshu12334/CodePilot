// ─────────────────────────────────────────────────────────
//  controllers/reviewController.js
//  Contains all business logic for calling Gemini API
// ─────────────────────────────────────────────────────────

const axios = require("axios");

// ── Gemini API Base URL ───────────────────────────────────
// We call Gemini via its REST endpoint using axios.
// The API key is read from the .env file — never hardcoded.
const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ── Helper: call Gemini REST API ─────────────────────────
// @param {string} prompt  – The full text prompt to send
// @returns {string}       – The AI response text
async function callGeminiAPI(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Safety check: ensure the key is set in .env
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env file");
  }

  // Make a POST request to the Gemini REST endpoint
  const response = await axios.post(
    `${GEMINI_BASE_URL}?key=${apiKey}`,
    {
      // Gemini expects this exact JSON structure
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
      // 60-second timeout to prevent requests hanging indefinitely
      timeout: 60000,
    }
  );

  // Extract the text from Gemini's nested response structure
  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response received from Gemini API");
  }

  return text;
}

// ── Helper: map Gemini error to user-friendly message ────
function handleGeminiError(err, res) {
  console.error("Gemini API error:", err?.response?.data || err.message);

  // Quota / rate-limit error (HTTP 429)
  if (err?.response?.status === 429) {
    return res.status(429).json({
      error:
        "⚠️ API quota exceeded. You have hit the Gemini free-tier limit. " +
        "Please wait a few minutes and try again, or upgrade your Google AI plan.",
    });
  }

  // Invalid API key (HTTP 400 / 403)
  if (
    err?.response?.status === 400 ||
    err?.response?.status === 403
  ) {
    return res.status(403).json({
      error:
        "🔑 Invalid or missing Gemini API key. " +
        "Please check your backend .env file.",
    });
  }

  // Network timeout
  if (err.code === "ECONNABORTED") {
    return res.status(504).json({
      error:
        "⏱️ The request to Gemini timed out. " +
        "The AI might be busy — please try again.",
    });
  }

  // Generic server-side error
  return res.status(500).json({
    error:
      "❌ Something went wrong on the server. " +
      "Please try again later.",
  });
}

// ── Controller: POST /api/review ─────────────────────────
// Receives { code, language } and returns an AI code review
async function reviewCode(req, res) {
  try {
    const { code, language } = req.body;

    // ── Input Validation ──────────────────────────────────
    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({ error: "No code provided. Please send your code in the request body." });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({ error: "No language specified. Please include the programming language." });
    }

    // ── Build the Review Prompt ───────────────────────────
    const prompt = `You are an expert AI code reviewer.

Analyze the following ${language} code and return a response in this exact structure:

## 🔴 Errors & Bugs
- List any bugs, logical errors, or runtime issues as short bullets.
- If none, write: None found.

## 📊 Code Quality
- Rating: Excellent / Good / Average / Poor
- One sentence on overall quality.

## ✨ Suggested Improvements
- Max 4 short bullet points. Practical, high-impact only.

## ✅ Fixed / Optimized Code
- Show corrected code block only if fixes are needed.
- If already good, write: No changes needed.

Rules:
- Entire response must stay under 150 words.
- Use clean markdown. No long introductions.
- Be concise like a senior engineer reviewing a PR.
- If quota or token limit is exceeded, return exactly: "API limit exceeded or unable to generate response. Please try again later."

Code (${language}):
${code}
`;

    // ── Call Gemini ───────────────────────────────────────
    const reviewText = await callGeminiAPI(prompt);

    // ── Return Success Response ───────────────────────────
    return res.status(200).json({ review: reviewText });

  } catch (err) {
    // Delegate to the error handler helper
    return handleGeminiError(err, res);
  }
}

// ── Controller: POST /api/fix ────────────────────────────
// Receives { code, language } and returns AI-fixed code
async function fixCode(req, res) {
  try {
    const { code, language } = req.body;

    // ── Input Validation ──────────────────────────────────
    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({ error: "No code provided. Please send your code in the request body." });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({ error: "No language specified. Please include the programming language." });
    }

    // ── Build the Fix Prompt ──────────────────────────────
    const prompt = `You are an expert AI code reviewer.

Analyze the following ${language} code and return a response in this exact structure:

## 🔧 What's Wrong
- Short bullet points listing bugs, errors, or issues.
- If none, write: No issues found.

## ✅ Fixed Code
Return the complete corrected code in a fenced code block.
Label changed lines with a short inline comment.

## 📝 What Changed
- Max 4 short bullet points explaining each fix.
- If no changes, write: No changes needed.

Rules:
- Keep entire response under 150 words.
- Return clean, copy-pasteable code.
- No long introductions or unnecessary explanations.
- If quota or token limit is exceeded, return exactly: "API limit exceeded or unable to generate response. Please try again later."

Code (${language}):
${code}
`;

    // ── Call Gemini ───────────────────────────────────────
    const fixedText = await callGeminiAPI(prompt);

    // ── Return Success Response ───────────────────────────
    return res.status(200).json({ review: fixedText });

  } catch (err) {
    return handleGeminiError(err, res);
  }
}

// Export both controllers so the router can use them
module.exports = { reviewCode, fixCode };
