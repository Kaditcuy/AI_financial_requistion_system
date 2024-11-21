const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin, isAuthenticated } = require("../middleware/authMiddleware");

//Logs actions performed by users for tracking purposes
router.post("/create-auditlog", isAuthenticated, isAdmin, async (req, res) => {
  const { userId, action, timestamp } = req.body;

  try {
    //Insert audit log entry into the database
    await db.query(
      "INSERT INTO audit_logs (user_id, action, timestamp) VALUES (?, ?, ?)",
      [userId, action, timestamp]
    );
    res.json({ message: "Audit log created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create audit log" });
  }
});

// routes for fetching audit logs (only admin)
router.get("/auditlogs", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const auditlogs = await db.query(
      "SELECT * FROM audit_logs ORDER BY timestamp DESC"
    );

    //return the audit logs in the response
    res.json(auditlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve audit logs" });
  }
});

module.exports = router;
