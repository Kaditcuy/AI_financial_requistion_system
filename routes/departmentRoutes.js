const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

//Handles the creation of a department by admin, eg., Finance, Procurement, or HR
router.post(
  "/create-department",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { name, description, businessId } = req.body;

    try {
      //Insert department into the db
      await db.query(
        "INSERT INTO departments (name, description, business_id) VALUES (?, ?, ?)",
        [name, description, businessId]
      );
      res.json({ message: "Department created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create department" });
    }
  }
);

module.exports = router;
