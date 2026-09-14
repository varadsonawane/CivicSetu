require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Pool } = require("pg");
const Groq = require("groq-sdk");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const bcrypt = require("bcryptjs");

const app = express();

const PORT = process.env.PORT || 5000;



// ======================================================
// GROQ AI
// ======================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================================================
// PostgreSQL
// ======================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// ======================================================
// CivicSetu AI Context
// ======================================================

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
- If the user asks about live reports, PostgreSQL is the source of truth.
`;

// ======================================================
// Middleware
// ======================================================

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// ======================================================
// Multer
// ======================================================

const upload = multer({
  dest: "uploads/",
});

// ======================================================
// Test API
// ======================================================

app.get("/api/test", (req, res) => {
  res.json({
    message: "CivicSetu backend is working!",
  });
});

// ======================================================
// CREATE A REPORT
// ======================================================

// ======================================================
// CREATE A REPORT
// ======================================================

app.post(
  "/api/reports",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
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
         (location, category, description, latitude, longitude, photo_url, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          location,
          category,
          description,
          latitude,
          longitude,
          photoUrl,
          req.user.id,
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
  }
);

// ======================================================
// GET ALL REPORTS
// ======================================================

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



// ======================================================
// GET MY REPORTS
// ======================================================

app.get("/api/reports/my", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM reports
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching my reports:", error);

    res.status(500).json({
      message: "Failed to fetch your reports.",
    });
  }
});
// ======================================================
// UPDATE REPORT STATUS
// ======================================================

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

// ======================================================
// DELETE REPORT
// ======================================================

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

// ======================================================
// GET REPORT STATISTICS
// ======================================================

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

// ======================================================
// GET CATEGORY STATISTICS
// ======================================================

const getCategoryStats = async () => {
  const result = await pool.query(`
    SELECT category, COUNT(*) AS count
    FROM reports
    GROUP BY category
    ORDER BY count DESC
  `);

  return result.rows;
};

// ======================================================
// GET SPECIFIC CATEGORY COUNT
// ======================================================

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

// ======================================================
// GET RECENT REPORTS
// ======================================================

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

    // Reports
    "how many reports",
    "how many complaints",
    "how many issues",

    "total reports",
    "total complaints",
    "total issues",

    // Pending
    "pending reports",
    "pending complaints",
    "pending issues",

    "unresolved reports",
    "unresolved complaints",
    "unresolved issues",

    // Resolved
    "resolved reports",
    "resolved complaints",
    "resolved issues",

    "solved reports",
    "solved complaints",
    "solved issues",

    // In Progress
    "in progress reports",
    "in progress complaints",
    "in progress issues",

    // Categories
    "most reported",
    "most common issue",
    "most common problem",
    "most common category",

    // Statistics
    "report statistics",
    "complaint statistics",
    "issue statistics",

    // Recent
    "recent reports",
    "latest reports",
    "recent complaints",
    "latest complaints",

    // Data
    "report data",
    "complaint data",
    "issue data",
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

  // ====================================================
  // Pending
  // ====================================================

  if (
    text.includes("pending") ||
    text.includes("unresolved")
  ) {
    const count = Number(stats.pending);

    if (count === 0) {
      return "There are currently no pending reports.";
    }

    return `There are currently ${count} pending reports.`;
  }

  // ====================================================
  // Resolved
  // ====================================================

  if (
    text.includes("resolved") ||
    text.includes("solved")
  ) {
    const count = Number(stats.resolved);

    if (count === 0) {
      return "There are currently no resolved reports.";
    }

    return `There are currently ${count} resolved reports.`;
  }

  // ====================================================
  // In Progress
  // ====================================================

  if (
    text.includes("in progress")
  ) {
    const count = Number(stats.in_progress);

    if (count === 0) {
      return "There are currently no reports in progress.";
    }

    return `There are currently ${count} reports in progress.`;
  }

  // ====================================================
  // Total Reports
  // ====================================================

  if (
    text.includes("total reports") ||
    text.includes("total complaints") ||
    text.includes("total issues") ||
    text.includes("how many reports") ||
    text.includes("how many complaints") ||
    text.includes("how many issues")
  ) {
    return `There are currently ${stats.total} total reports in CivicSetu.`;
  }

  // ====================================================
  // Most Reported Category
  // ====================================================

  if (
    text.includes("most reported") ||
    text.includes("most common problem") ||
    text.includes("most common issue") ||
    text.includes("most common category")
  ) {
    const categories = await getCategoryStats();

    if (categories.length === 0) {
      return "There are no reports in the database yet.";
    }

    const topCategory = categories[0];

    return `${topCategory.category} is currently the most reported category, with ${topCategory.count} report(s).`;
  }

  // ====================================================
  // Category Statistics
  // ====================================================

  if (
    text.includes("category") ||
    text.includes("categories")
  ) {
    const categories = await getCategoryStats();

    if (categories.length === 0) {
      return "There are no reports in the database yet.";
    }

    return categories
      .map(
        (item) =>
          `${item.category}: ${item.count}`
      )
      .join("\n");
  }

  // ====================================================
  // Recent Reports
  // ====================================================

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

  // ====================================================
  // General Report Question
  // ====================================================

  return `
CivicSetu currently has ${stats.total} total reports:
${stats.pending} pending,
${stats.in_progress} in progress,
and ${stats.resolved} resolved.
`;
};

// ======================================================
// CIVICSETU KNOWLEDGE ANSWERS
// ======================================================

const getCivicSetuAnswer = (message) => {
  const text = message.toLowerCase().trim();

  // ====================================================
  // Greetings
  // ====================================================

  if (
    text === "hi" ||
    text === "hii" ||
    text === "hiii" ||
    text === "hello" ||
    text === "hey" ||
    text === "hlo"
  ) {
    return "👋 Hello! I'm the CivicSetu Assistant. How can I help you today?";
  }

  // ====================================================
  // What is CivicSetu?
  // ====================================================

  if (
    text.includes("what is civicsetu") ||
    text.includes("what is civic setu")
  ) {
    return "CivicSetu is a civic issue reporting and tracking platform that helps citizens report local civic problems and allows administrators to monitor and manage them.";
  }

  // ====================================================
  // About CivicSetu
  // ====================================================

  if (
    text.includes("tell about civicsetu") ||
    text.includes("tell me about civicsetu") ||
    text.includes("tell about civic setu") ||
    text.includes("tell me about civic setu") ||
    text.includes("about civicsetu") ||
    text.includes("about civic setu")
  ) {
    return "CivicSetu is a civic issue reporting and tracking platform that connects citizens and administrators. Citizens can report local problems, while administrators can monitor and manage those reports.";
  }

  // ====================================================
  // How does CivicSetu work?
  // ====================================================

  if (
    text.includes("how does it work") ||
    text.includes("how does it works") ||
    text.includes("how does civicsetu work") ||
    text.includes("how does civicsetu works") ||
    text.includes("how civicsetu works") ||
    text.includes("how civicsetu work") ||
    text.includes("how does civic setu work") ||
    text.includes("how does civic setu works") ||
    text.includes("how does this work") ||
    text.includes("how this works")
  ) {
    return "CivicSetu works in a simple flow: citizens report a civic issue with its category, description, location and photo. The backend stores the report in PostgreSQL, and administrators can monitor it through the dashboard and update its status from Pending to In Progress to Resolved.";
  }

  // ====================================================
  // Reporting an Issue
  // ====================================================

  if (
    text.includes("how to report") ||
    text.includes("how can i report") ||
    text.includes("report an issue") ||
    text.includes("report issue") ||
    text.includes("submit a complaint") ||
    text.includes("submit an issue") ||
    text.includes("how do i report")
  ) {
    return "To report an issue, open the Report Issue page and provide the category, description, location and optionally GPS coordinates and a photo. Submit the form and the report is stored in CivicSetu's database.";
  }

  // ====================================================
  // Admin Dashboard
  // ====================================================

  if (
    text.includes("admin dashboard") ||
    text.includes("admin panel") ||
    text.includes("what can admin") ||
    text.includes("admin do") ||
    text.includes("what does admin")
  ) {
    return "The Admin Dashboard allows administrators to view, search and filter reports, see them on the map, update their status and delete reports.";
  }

  // ====================================================
  // Live Map
  // ====================================================

  if (
    text.includes("live map") ||
    text.includes("map work") ||
    text.includes("map show") ||
    text.includes("what does the map") ||
    text.includes("issue map")
  ) {
    return "The CivicSetu live map displays reported civic issues geographically. Red markers represent Pending issues, yellow markers represent In Progress issues, and green markers represent Resolved issues.";
  }

  // ====================================================
  // Report Status
  // ====================================================

  if (
    text.includes("what does pending mean") ||
    text.includes("what does in progress mean") ||
    text.includes("what does resolved mean") ||
    text.includes("report status") ||
    text.includes("status mean")
  ) {
    return "A report starts as Pending, changes to In Progress when administrators begin handling it, and becomes Resolved when the civic issue has been fixed.";
  }

  // ====================================================
  // Features
  // ====================================================

  if (
    text.includes("features of civicsetu") ||
    text.includes("civicsetu features") ||
    text.includes("what can civicsetu do") ||
    text === "features"
  ) {
    return "CivicSetu provides civic issue reporting, PostgreSQL-based report storage, a live issue map, report status tracking, an admin dashboard and an AI assistant.";
  }

  // ====================================================
  // Database / Technology
  // ====================================================

  if (
    text.includes("which database") ||
    text.includes("what database") ||
    text.includes("database used") ||
    text.includes("backend used") ||
    text.includes("technology used") ||
    text.includes("what technology")
  ) {
    return "CivicSetu uses a Node.js and Express backend with PostgreSQL as its database. The frontend communicates with the backend through APIs.";
  }

  // ====================================================
  // Creator
  // ====================================================

  if (
    text.includes("who created civicsetu") ||
    text.includes("who made civicsetu") ||
    text.includes("who built civicsetu")
  ) {
    return "CivicSetu was created by Varad Sonawane.";
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

    // ==================================================
    // 1. CIVICSETU KNOWLEDGE
    // ==================================================

    const civicSetuAnswer = getCivicSetuAnswer(message);

    if (civicSetuAnswer) {
      console.log("Using CivicSetu information...");

      return res.json({
        reply: civicSetuAnswer,
      });
    }

    // ==================================================
    // 2. DATABASE QUESTIONS
    // ==================================================

    if (isDatabaseQuestion(message)) {
      console.log("Using PostgreSQL...");

      const reply = await handleDatabaseQuestion(message);

      console.log("Database reply:", reply);

      return res.json({
        reply,
      });
    }

    // ==================================================
    // 3. GENERAL QUESTIONS → GROQ
    // ==================================================

    console.log("Using Groq...");

    if (!process.env.GROQ_API_KEY) {
      console.log("GROQ_API_KEY is missing.");

      return res.json({
        reply:
          "CivicSetu AI is currently under maintenance. Please visit again in a little while. Thank you for your patience! 🙏",
      });
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
${civicSetuContext}

IMPORTANT AI RULES:

- You are the official CivicSetu AI Assistant.
- Be helpful, friendly and concise.
- Answer CivicSetu questions based only on the provided CivicSetu information.
- Do not invent CivicSetu features.
- Do not invent report statistics.
- PostgreSQL is the source of truth for live report data.
- Keep answers to approximately 1-3 sentences.
- If a question is unrelated to CivicSetu, politely explain that you are mainly designed to assist with CivicSetu.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],

      max_completion_tokens: 100,
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "I couldn't generate a response right now.";

    return res.json({
      reply,
    });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      reply:
        "CivicSetu AI is currently under maintenance. Please visit again in a little while. Thank you for your patience! 🙏",
    });
  }
});

// ======================================================
// DATABASE CONNECTION TEST
// ======================================================

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected successfully!");
    console.log(result.rows[0]);
  }
});


// ======================================================
// AUTHENTICATION
// ======================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role, created_at
      `,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Account created successfully.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
});




// ======================================================
// MIDDLEWARE
// ======================================================

app.get("/api/auth/test", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});


app.get(
  "/api/admin/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
      user: req.user,
    });
  }
);

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});