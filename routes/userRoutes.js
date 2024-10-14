const express = require("express");
const router = express.Router();
const db = require("../db"); // Import your database connection

/** ======= User Management (Admin Only) ========== **/
// Fetch all users (restricted to admins)
router.get("/users", async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users"); // Adjust as needed
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Fetch details of a specific user (admin only)
router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [user] = await db.query("Select * FROM users WHERE id = ?", [userId]);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found " });
    }
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Add new users directly (admin only)
router.post("/users", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await db.query("INSERT INTO users (name, email, role) VALUES (?, ?, ?)", [
      name,
      email,
      role,
    ]);
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Update specific user's information (admin only)
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, userId]
    );
    res.json({ message: "User Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user from the system (admin only)
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Update role of a specific user (admin only)
router.put("/users/:id/role", async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  try {
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
    res.json({ message: "User role updated succesfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// Enable or disable a user's account (admin only)
router.put("/users/:id/status", async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;
  try {
    await db.query("UPDATE users SET status = ? WHERE id = ?", [
      status,
      userId,
    ]);
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// Fetch a user's activity log (admin only)
router.get("/users/:id/activities", async (req, res) => {
  const userId = req.params.id;
  try {
    const activities = await db.query(
      "SELECT * FROM activities WHERE user_id = ?",
      [userId]
    );
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user activities" });
  }
});

/** ======= User Registration & Authentication ====== **/
// Register a new user
router.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    ); //there's no role here because that function is only for an admin and the default if not selected upon user creation is regular_user
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// User login
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

// User logout
router.post("/users/logout", async (req, res) => {
  //Assuming a session-based logout
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

/** ======= User Profile & Account Management ======= **/
// Fetch profile of the currently logged-in user
router.get("/users/profile", async (req, res) => {
  const userId = req.session.userId;
  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// Update profile information of the currently logged-in user
router.put("/users/profile", async (req, res) => {
  const userId = req.session.userId;
  const { name, email } = req.body;
  try {
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      userId,
    ]);
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password of the logged-in user
router.put("/users/password/change", async (req, res) => {
  const userId = req.session.userId;
  const { newPassword } = req.body;
  try {
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password " });
  }
});

// Allow users to reset their password
router.put("/users/password/reset", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      newPassword,
      email,
    ]);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset Password" });
  }
});

/** ======= User Activities & Notifications ======= **/
// Retrieve notifications for the logged-in user
router.get("/users/notifications", async (req, res) => {
  const userId = req.session.userId;
  try {
    const notifications = await db.query(
      "SELECT * FROM notifications WHERE user_id = ?",
      [userId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
