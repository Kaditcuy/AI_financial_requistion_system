const isAuthenticated = (req, res, next) => {
  if (req.user) {
    //assuming the user is set when the user is authenticated
    return next();
  }
  return res.status(400).json({ error: "User not authenticated" });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    //assuming req.user.role is set to admin
    return next();
  }
  return res.status(400).json({ error: "Access denied" });
};

module.exports = { isAuthenticated, isAdmin };
