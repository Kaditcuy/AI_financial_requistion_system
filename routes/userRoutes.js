const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); //Password hasher
const db = require("../db"); // Import your database connection
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware"); // Adjust the path based on your folder structure


/** Route to create an admin user */
router.post("/create-admin", async (req, res) => {
  const { name, password, email } = req.body;

  //Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //Insert new admin user into the database
    await db.query(
      "INSERT INTO users (name, password, email, role, buisnessId) VALUES (?, ?, ?, ?, ?)",
      [name, hashedPassword, email, "admin", null]
    );
    res.json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create admin user" });
  }
});

/** ======= User Management (Admin Only) ========== **/
// Fetch all users (restricted to admins)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users"); // Adjust as needed
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Fetch details of a specific user (admin only)
router.get("/:id", isAuthenticated, isAdmin, async (req, res) => {
  console.log("Request received for user ID:", req.params.id); // Debug log
  const userId = req.params.id;
  try {
    const [user] = await db.query("Select * FROM users WHERE id = ?", [userId]);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found " });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Add new users directly (admin only)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);

  const { name, password, email, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  try {
    // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "regular_user"]
    );
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Update specific user's information (admin only)
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

   // Log the request body for debugging
   console.log("Request Body:", req.body);


// Ensure role is provided and valid
if (role && !['admin', 'regular_user'].includes(role)) {
  return res.status(400).json({ error: "Invalid role. Role must be 'admin' or 'regular_user'." });
}

  //Prepare the SQL query and values dynamically based on the previous fields
  let updateFields = [];
  let values =[];

  if (name) {
    updateFields.push("name  = ?");
    values.push(name);
  }
  if (email) {
    updateFields.push("email  = ?");
    values.push(name);
  }
  if (role) {
    updateFields.push("role  = ?");
    values.push(role);
  }

    // If no fields were provided, return an error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "At least one field (name, email, role) must be provided" });
    }

  values.push(userId);

  const query = `UPDATE users SET ${updateFields.join(",")} WHERE id = ?`;
  
  // Log the query and values for debugging
  console.log("Query:", query);
  console.log("Values:", values);

  try {
    await db.query(query, values);
    res.json({ message: "User Updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user from the system (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const userId = req.params.id;
  console.log(`Attempting to delete user with ID: ${userId}`);
  try {
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


// Enable or disable a user's account (admin only)
router.put("/users/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;
  try {
    await db.query("UPDATE users SET status = ? WHERE id = ?", [
      status,
      userId,
    ]);
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// Fetch a user's activity log (admin only)
router.get(
  "/users/:id/activities",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const userId = req.params.id;
    try {
      const activities = await db.query(
        "SELECT * FROM activities WHERE user_id = ?",
        [userId]
      );
      res.json(activities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  }
);

/** ======= User Registration & Authentication ====== **/
// Register a new user
router.post("/sign-up", async (req, res) => {
  const { name, email, password, buisnessId } = req.body;

  //hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.query(
      "INSERT INTO users (name, email, password, role, buisnessId) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, "regular_user", buisnessId]
    ); //there's no role here because that function is only for an admin and the default if not selected upon user creation is regular_user
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error('Error during registration: ', error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // if user not found
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0]; //Acess the first user object in the array

    console.log("User found:", user); //log user object ti check if password is correctly retrieved

    if(!user.password){
      return res.status(500).json({ message: "Password not found for user" });
    }

    console.log("Password from database:", user.password);  // Log the hashed password from database

    //compare hashed password with provided password
    const match = await bcrypt.compare(password, user.password)
    if ( match) {

      console.log("JWT Secret:", process.env.JWT_SECRET); // This should log your secret key

      // Generate JWT token   //payload with user's id and role //secret key(store in env var) //
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      //send the token as a response allowing for sessionStorage along with success message
      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed" });
  }
});

// User logout
router.post("/users/logout", isAuthenticated, async (req, res) => {
  //Assuming a session-based logout
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

/** ======= User Profile & Account Management ======= **/
// Fetch profile of the currently logged-in user
router.get("/profile", isAuthenticated, async (req, res) => {
  const userId = req.user.id; //Acessing the userId from the decoded token
  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// Update profile information of the currently logged-in user
router.put("/users/profile", isAuthenticated, async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password of the logged-in user
router.put("/users/password/change", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
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
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset Password" });
  }
});

/** ======= User Activities & Notifications ======= **/
// Retrieve notifications for the logged-in user
router.get("/users/notifications", isAuthenticated, async (req, res) => {
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
