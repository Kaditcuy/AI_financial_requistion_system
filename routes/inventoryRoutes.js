const express = require("express");
const router = express.Router ();
const db = require("../db.js");
const { isAdmin, isAuthenticated } = require("../middleware/authMiddleware");

//Create an inventory item (admin) only
router.post("/inventory", isAuthenticated, isAdmin, async (req, res) => {
  const { product_id, quantity_available, quantity_ordered, reorder_level } =
    req.body;

  try {
    const result = await db.query(
      "INSERT INTO inventory_management(product_id, quantity_available, quantity_ordered, reorder_level) VALUES (?, ?, ?, ?)",
      [product_id, quantity_available, quantity_ordered, reorder_level]
    );
    res.status(201).json({
      message: "Inventory entry created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create inventory entry" });
  }
});

//Get all inventory data
router.get("/inventory", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM inventory_management");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve inventory entries" });
  }
});

//Get Inventory data for a specific product
router.get(
  "/inventory/:product_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { product_id } = req.params;
    try {
      const [rows] = await db.query(
        "SELECT * FROM inventory_management WHERE product_id = ?",
        [product_id]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Inventory entry not found for this product" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve inventory entry" });
    }
  }
);

//Update inventory data
router.put("/inventory/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { quantity_available, quantity_ordered, reorder_level } = req.body;

  try {
    await db.query(
      "UPDATE inventory_management SET quantity_available = ?, quantity_ordered = ?, reorder_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [quantity_available, quantity_ordered, reorder_level, id]
    );
    res.json({ message: "Inventory entry updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update inventory level" });
  }
});

//delete inventory data
router.delete("/inventory/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM inventory_management WHERE id = ?", [id]);
    res.json({ message: "Inventory entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete inventory entry" });
  }
});

module.exports = router;
