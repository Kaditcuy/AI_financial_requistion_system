const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAuthenticated } = require("../middleware/authMiddleware"); // Adjust the path based on your folder structure


//creating payment record
router.post("/create-payment", isAuthenticated, async (req, res) => {
  const { requisitionId, amount, status, paymentDate } = req.body;

  try {
    // Insert payment record into the database
    await db.query(
      "INSERT INTO payments (requisition_id, amount, status, payment_date) VALUES (?, ?, ?, ?)",
      [requisitionId, amount, status, paymentDate]
    );
    res.json({ message: "Payment record created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment record" });
  }
});

module.exports = router;
