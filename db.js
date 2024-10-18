const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "fingergod", // Update with your password
  database: "financial_requisition_system", // Update with your database name
});

module.exports = db;
