require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
//const mysql = require("mysql2");
const userRoutes = require("./routes/userRoutes"); //exports the router in the userRoutes file and stores it in the userRoutes variable and what that means is that the userRoutes variable contains all the endpoints related to users operations like retrieving users data
const productRoutes = require("./routes/productRoutes"); // Add missing imports
const inventoryRoutes = require("./routes/inventoryRoutes");
const requistionRoutes = require("./routes/requistionRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const auditlogRoutes = require("./routes/auditlogRoutes"); // Correct the name for consistency
const approvalRoutes = require("./routes/approvalRoutes");

const app = express();
const port = process.env.PORT || 3000; // Choose your desired port

app.use(bodyParser.json()); // Middleware to parse JSON bodies good for handling incoming requests

app.get("/", (req, res) => {
  res.send("Welcome to the AI Financial Requisition System");
});

//define API routes
console.log("Loading user routes...");
app.use("/api/users", userRoutes); // Prefix API routes of all users operatons with /api
console.log("Loading product routes...");
app.use("/api/products", productRoutes); //all endpoints of products operation
app.use("/api/inventory", inventoryRoutes);
app.use("/api/requisition", requistionRoutes);
app.use("/api/departtment", departmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/audit-log", auditlogRoutes);
app.use("/api/approvals", approvalRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
