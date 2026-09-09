require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Pool } = require("pg");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = 5000;

// =========================
// PostgreSQL
// =========================

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "civicsetu",
  password: "Varad@8055",
  port: 5432,
});

// =========================
// Gemini AI
// =========================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =========================
// CivicSetu AI Context
// =========================

const civicSetuContext = `
You are the official AI assistant for CivicSetu.

ABOUT CIVICSETU:

CivicSetu is a civic issue reporting and tracking platform created by Varad Sonawane.

The main goal of CivicSetu is to connect citizens and administrators
so that local civic problems can be reported, monitored and resolved
in a more transparent and organized way.

CIVICSETU WEBSITE FLOW:

1. HOME PAGE

The home page introduces CivicSetu and explains its purpose.
Citizens can learn about the platform and access the issue reporting system.
The home page also contains a live map showing reported civic issues.

2. REPORT AN ISSUE

A citizen can report a local civic problem through the Report Issue page.

The citizen can provide:
- Issue category
- Description of the problem
- Location
- GPS coordinates
- Photo of the problem

The report is submitted to the CivicSetu backend.

3. BACKEND AND DATABASE

The CivicSetu backend is built using Node.js and Express.

When a citizen submits a report, the backend receives the information
and stores the report in a PostgreSQL database.

The database stores information such as:
- Report ID
- Category
- Description
- Location
- Latitude
- Longitude
- Photo
- Status
- Created date

4. LIVE ISSUE MAP

CivicSetu has a live map that displays reported issues geographically.

Reports can appear on the map with different status indicators:

- Pending = Red
- In Progress = Yellow
- Resolved = Green

The map helps users and administrators understand where civic problems
are occurring.

5. ADMIN DASHBOARD

Administrators can manage submitted civic reports through the Admin Dashboard.

The dashboard allows administrators to:
- View reports
- Search reports
- Filter reports by category
- Filter reports by status
- View reports on the map
- Change report status
- Delete reports

6. REPORT STATUS FLOW

Every report can move through different stages:

Pending
    ↓
In Progress
    ↓
Resolved

Pending means the issue has been reported but has not started being worked on.

In Progress means the issue is currently being handled.

Resolved means the reported issue has been resolved.

7. AI ASSISTANT

CivicSetu includes an AI assistant that helps users interact with
the platform using natural language.

The assistant can answer questions about:
- CivicSetu
- How the website works
- The reporting process
- Website features
- The report system
- Current report statistics
- Report statuses
- Report categories

For live report information, PostgreSQL is the source of truth.

IMPORTANT:

- Answer questions about CivicSetu based on this information.
- Do not invent features that CivicSetu does not have.
- Do not invent report statistics.
- Do not claim that CivicSetu has features that are not described here.
- Keep answers short and conversational.
- Usually answer in 1-3 sentences.
- Explain the website flow when the user asks how CivicSetu works.
- If the user asks about live reports, use the database information provided by the backend.
`;

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// =========================
// Multer
// =========================

const upload = multer({ dest: "uploads/" });

// =========================
// Test API
// =========================

app.get("/api/test", (req, res) => {
  res.json({
    message: "CivicSetu backend is working!",
  });
});

// =========================
// Create a Report
// =========================

app.post("/api/reports", upload.single("photo"), async (req, res) => {
  try {
    const {
      location,
      category,
      description,
      latitude,
      longitude,
    } = req.body;

    const photoUrl = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO reports
       (location, category, description, latitude, longitude, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        location,
        category,
        description,
        latitude,
        longitude,
        photoUrl,
      ]
    );

    console.log("Report saved successfully!");

    res.status(201).json({
      message: "Report created successfully!",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving report:", error);

    res.status(500).json({
      message: "Failed to save report.",
    });
  }
});

// =========================
// Get All Reports
// =========================

app.get("/api/reports", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reports ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reports:", error);

    res.status(500).json({
      message: "Failed to fetch reports.",
    });
  }
});

// =========================
// Update Report Status
// =========================

app.patch("/api/reports/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const result = await pool.query(
      `UPDATE reports
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    res.json({
      message: "Status updated successfully!",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating status:", error);

    res.status(500).json({
      message: "Failed to update status.",
    });
  }
});

// =========================
// Delete Report
// =========================

app.delete("/api/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM reports WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    console.log(`Report ${id} deleted successfully!`);

    res.json({
      message: "Report deleted successfully!",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting report:", error);

    res.status(500).json({
      message: "Failed to delete report.",
    });
  }
});

// ======================================================
// DATABASE FUNCTIONS FOR CHATBOT
// ======================================================

// =========================
// Get Report Statistics
// =========================

const getReportStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress,
      COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved
    FROM reports
  `);

  return result.rows[0];
};

// =========================
// Get Category Statistics
// =========================

const getCategoryStats = async () => {
  const result = await pool.query(`
    SELECT category, COUNT(*) AS count
    FROM reports
    GROUP BY category
    ORDER BY count DESC
  `);

  return result.rows;
};

// =========================
// Get Specific Category Count
// =========================

const getCategoryCount = async (category) => {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM reports
    WHERE LOWER(category) = LOWER($1)
    `,
    [category]
  );

  return Number(result.rows[0].count);
};

// =========================
// Get Recent Reports
// =========================

const getRecentReports = async () => {
  const result = await pool.query(`
    SELECT id, category, location, status, created_at
    FROM reports
    ORDER BY created_at DESC
    LIMIT 5
  `);

  return result.rows;
};

// ======================================================
// DETECT DATABASE QUESTIONS
// ======================================================

const isDatabaseQuestion = (message) => {
  const text = message.toLowerCase().trim();

  const databasePatterns = [
    // Reports / complaints / issues
    "report",
    "reports",
    "complaint",
    "complaints",
    "issue",
    "issues",
    "problem",
    "problems",

    // Status
    "pending",
    "unresolved",
    "not resolved",
    "open complaint",
    "open complaints",
    "open issue",
    "open issues",

    "resolved",
    "resolve",
    "solved",
    "completed",

    "in progress",
    "being worked on",
    "under work",

    // Counts
    "how many",
    "how much",
    "count",
    "number of",
    "total",

    // Categories / statistics
    "category",
    "categories",
    "most reported",
    "most common",
    "highest number",

    // Recent data
    "recent report",
    "recent reports",
    "latest report",
    "latest reports",

    "recent complaint",
    "recent complaints",
    "latest complaint",
    "latest complaints",

    // Database-type questions
    "statistics",
    "stats",
    "data"
  ];

  return databasePatterns.some((pattern) =>
    text.includes(pattern)
  );
};

// ======================================================
// DATABASE CHAT HANDLER
// ======================================================

const handleDatabaseQuestion = async (message) => {
  const text = message.toLowerCase();

  const stats = await getReportStats();

  // =========================
  // Pending
  // =========================

  if (
    text.includes("pending") ||
    text.includes("not resolved") ||
    text.includes("open complaints")
  ) {
    const count = Number(stats.pending);

    if (count === 0) {
      return "There are currently no pending reports.";
    }

    return `There are currently ${count} pending reports.`;
  }

  // =========================
  // Resolved
  // =========================

  if (
    text.includes("resolved") ||
    text.includes("solved") ||
    text.includes("completed")
  ) {
    const count = Number(stats.resolved);

    if (count === 0) {
      return "There are currently no resolved reports.";
    }

    return `There are currently ${count} resolved reports.`;
  }

  // =========================
  // In Progress
  // =========================

  if (
    text.includes("in progress") ||
    text.includes("being worked") ||
    text.includes("under work")
  ) {
    const count = Number(stats.in_progress);

    if (count === 0) {
      return "There are currently no reports in progress.";
    }

    return `There are currently ${count} reports in progress.`;
  }

  // =========================
  // Total Reports
  // =========================

  if (
    text.includes("total reports") ||
    text.includes("total complaints") ||
    text.includes("how many reports") ||
    text.includes("how many complaints")
  ) {
    return `There are currently ${stats.total} total reports in CivicSetu.`;
  }

  // =========================
  // Most Reported Category
  // =========================

  if (
    text.includes("most reported") ||
    text.includes("most common problem") ||
    text.includes("most common issue")
  ) {
    const categories = await getCategoryStats();

    if (categories.length === 0) {
      return "There are no reports in the database yet.";
    }

    const topCategory = categories[0];

    return `${topCategory.category} is currently the most reported category, with ${topCategory.count} report(s).`;
  }

  // =========================
  // Category Statistics
  // =========================

  if (
    text.includes("category") ||
    text.includes("categories")
  ) {
    const categories = await getCategoryStats();

    if (categories.length === 0) {
      return "There are no reports in the database yet.";
    }

    return categories
      .map((item) => `${item.category}: ${item.count}`)
      .join("\n");
  }

  // =========================
  // Recent Reports
  // =========================

  if (
    text.includes("latest reports") ||
    text.includes("recent reports") ||
    text.includes("latest complaints") ||
    text.includes("recent complaints")
  ) {
    const reports = await getRecentReports();

    if (reports.length === 0) {
      return "There are no reports in the database yet.";
    }

    return reports
      .map(
        (report) =>
          `${report.category} — ${report.status} — ${report.location}`
      )
      .join("\n");
  }

  // =========================
  // General Report Question
  // =========================

  return `CivicSetu currently has ${stats.total} total reports: ${stats.pending} pending, ${stats.in_progress} in progress, and ${stats.resolved} resolved.`;
};


const getCivicSetuAnswer = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("what is civicsetu") ||
    text.includes("what is civic setu")
  ) {
    return "CivicSetu is a civic issue reporting and tracking platform that helps citizens report and track local civic problems.";
  }

  if (
    text.includes("how does civicsetu work") ||
    text.includes("how does civic setu work") ||
    text.includes("how civicsetu works")
  ) {
    return "Citizens submit civic issues with details such as category, description, location and photos. Administrators can then monitor the reports, update their status and manage them through the dashboard.";
  }

  if (
    text.includes("who created civicsetu") ||
    text.includes("who made civicsetu") ||
    text.includes("who built civicsetu")
  ) {
    return "CivicSetu was created by Varad Sonawane.";
  }

  if (
    text.includes("features of civicsetu") ||
    text.includes("civicsetu features") ||
    text.includes("what can civicsetu do")
  ) {
    return "CivicSetu provides civic issue reporting, a live issue map, report tracking, an admin dashboard and an AI assistant.";
  }

  return null;
};

// ======================================================
// CHAT AI / CIVIC ASSISTANT
// ======================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "Please enter a message.",
      });
    }

    console.log("User:", message);

    // 1. CivicSetu information
    const civicSetuAnswer = getCivicSetuAnswer(message);

    if (civicSetuAnswer) {
      console.log("Using CivicSetu information...");

      return res.json({
        reply: civicSetuAnswer,
      });
    }

    // 2. Database questions
    if (isDatabaseQuestion(message)) {
      console.log("Using PostgreSQL...");

      const reply = await handleDatabaseQuestion(message);

      console.log("Database reply:", reply);

      return res.json({
        reply,
      });
    }

    // 3. General questions → Gemini
    console.log("Using Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
${civicSetuContext}

USER QUESTION:
${message}

Answer directly and briefly.
Keep the answer to 1-3 sentences.
`,
      config: {
        maxOutputTokens: 100,
      },
    });

    return res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
reply:
  "CivicSetu AI is currently under maintenance. Please visit again in a little while. Thank you for your patience! 🙏",    });
  }
});

// =========================
// Database Connection Test
// =========================

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected successfully!");
    console.log(result.rows[0]);
  }
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});