const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();

const PORT = 5000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "civicsetu",
  password: "Varad@8055",
  port: 5432,
});



// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Multer
const upload = multer({ dest: "uploads/" });

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "CivicSetu backend is working!",
  });
});

// Create a report
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

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected successfully!");
    console.log(result.rows[0]);
  }
});


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

// Update report status
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

// Delete a report
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});