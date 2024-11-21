const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin, isAuthenticated } = require("../middleware/authMiddleware");

//Create an approval record (Accessible to authenticated users)
router.post("/create-approval", isAuthenticated, async (req, res) => {
  const { requisition_id, status } = req.body;
  const approver_id = req.user.id; //Get the id of the authenticated admin

  try {
    //Insert apporoval record into the db
    await db.query(
      "INSERT INTO approvals (requisiton_id, approver_id, status) VALUES (?, ?, ?)",
      [requisition_id, approver_id, status]
    );
    res.json({ message: "Approval record created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create approval record" });
  }
});

//Update an approval record (Accessible to authenticated users, typically approvers or admins)
router.put("/update-approval", isAuthenticated, async (req, res) => {
  const { id } = req.params; //Approval record ID
  const { status } = req.body; //New status (approved, rejetced, pending)

  try {
    //Update the status of an approval record
    const result = await db.query(
      "UPDATE approvals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id ?",
      [status, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Approval status updated successfully" });
    } else {
      res.status(404).json({ error: "Approval record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update approval record" });
  }
});

//Get all approvals (Accessible to admins)
router.get("/approvals", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const approvals = await db.query(
      "SELECT * FROM approvals ORDER BY created_at DESC"
    );
    res.json(approvals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve approvals" });
  }
});

// Get approvals for a specific requisition (Accessible to admins or users who created the requisition)
router.get(
  "/approvals/requisition/:requisitionId",
  isAuthenticated,
  async (req, res) => {
    const { requisitionId } = req.params;

    try {
      const approvals = await db.query(
        "SELECT * FROM approvals WHERE requisition_id = ? ORDER BY created_at DESC",
        [requisitionId]
      );
      res.json(approvals);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to retrieve approvals for this requisition" });
    }
  }
);

// Get approvals by a specific approver (Accessible to the approver or admin)
router.get(
  "/approvals/approver/:approverId",
  isAuthenticated,
  async (req, res) => {
    const { approverId } = req.params;

    try {
      const approvals = await db.query(
        "SELECT * FROM approvals WHERE approver_id = ? ORDER BY created_at DESC",
        [approverId]
      );
      res.json(approvals);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to retrieve approvals by this approver" });
    }
  }
);

module.exports = router;
