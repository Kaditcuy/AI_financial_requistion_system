const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; //expcting bearer token
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }
  try {
    //verify and decode the token gotten from the request headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
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
