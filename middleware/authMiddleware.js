const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  console.log("Checking authentication...");

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("No Authorization header provided.");
    return res.status(401).json({ error: "Access denied. No token provided" });
  }
  
  const token = req.headers.authorization?.split(" ")[1]; // Expecting Bearer token
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }
  try {
    // Verify and decode the token gotten from the request headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload to the request object
    return next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Log the error details
    console.error("JWT Verification Error:", err.message, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    // Differentiate between error types for specific responses
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired. Please log in again." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token. Please log in again." });
    } else {
      return res.status(403).json({ error: "Authentication failed." });
    }
  }
};


const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden, admin access only" });
  }
  console.log("Admin Access Granted:", req.user);
  next();
};

module.exports = { isAuthenticated, isAdmin };
