const express = require("express");
const router = express.Router;
const db = require("../db.js");
const { isAdmin, isAuthenticated } = require("../middleware/authMiddleware");
/** Integrating core functionalites that facilitate the requistion process */

// ====== Admin Requistion Routes ======== //

//Create a new requistion order (Admin) and also on behalf of other users
router.post("/requisition", isAuthenticated, isAdmin, async (req, res) => {
  const { title, amount, description, status } = req.body; //make sure client form on admin side contains a part to collect users_id

  try {
    const result = await db.query(
      "INSERT INTO requisition (title, user_id, amount, description, status) VALUES (?, NULL, ?, ?, ?)",
      [title, amount, description, status || "pending"]
    );
    res.status(201).json({
      message: "Requisition created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create requisition " });
  }
});

//View a requisiton order only for Admin or the user who created it
router.get("/requisition/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.userId;
  try {
    const [rows] = await db.query("SELECT * FROM requisition WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Requisiton not found" });
    }
    const requisiton = rows[0];

    //check if the user is an adMin or if the user is the creator pf the requisition
    if (req.user.role === "admin" || requisiton.user_id === user_id) {
      return res.json(requisiton);
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve requisiton" });
  }
});

//Update a requistion order only for Admin
router.put("/requisition/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { title, amount, description, status } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE requisition SET title = ?, amount = ?, description = ?, status = ? WHERE id = ?",
      [title, amount, description, status, id]
    );
    res.json({ message: "Requisition updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update requisition" });
  }
});

//List all requisiton order
router.get("/requisition", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requisition");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve requisitions" });
  }
});

//delete a requistion order only for admin
router.delete(
  "/requisition/:id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM requisition WHERE id = ?", [id]);
      res.json({ message: "Requisition deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete requisition " });
    }
  }
);

// ========= User-Specific Routes ======= //
// Create a requsition order (user)
router.post("/user/requisition", isAuthenticated, async (req, res) => {
  const { title, amount, description, status } = req.body;
  const user_id = req.session.userId;

  try {
    const result = await db.query(
      "INSERT INTO requisition (title, user_id, amount, description, status) VALUES (?, ?, ?, ?, ?)",
      [title, user_id, amount, description, status || "pending"]
    );
    res.status(201).json({
      message: "Requisition created successfully",
      id: result.inseertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create requisition" });
  }
});

//list requisition orders created by rhe user
router.get("/user/requisition", isAuthenticated, async (req, res) => {
  const user_id = req.session.userId;
  try {
    const [rows] = await db.query(
      "SELECT * FROM requisition WHERE user_id = ?",
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user requisitons" });
  }
});

//cancel a requisition order(users can only cancel theirs)
router.delete("/user/requisition/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.userId;
  try {
    const [rows] = await db.query(
      "DELETE FROM requisition WHERE id = ? and user_id = ?",
      [id, user_id]
    );
    if (rows.affectedRows === 0) {
      //affected rows simply how many rows where modified
      return res.status(404).json({ error: "Requisiton not found" });
    }
    res.json({ message: "Requsiiton canceled successsfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel requisition" });
  }
});

module.exports = router;
