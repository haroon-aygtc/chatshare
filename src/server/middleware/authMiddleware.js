const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateJWT = (req, res, next) => {
  // Get token from header, cookie, or query parameter
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.cookies?.token ||
    req.query?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to check if user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await userModel.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Middleware to check if user owns the resource or is an admin
 * @param {string} userIdField - The field name that contains the user ID
 * @returns {Function} - Express middleware function
 */
const isOwnerOrAdmin = (userIdField) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await userModel.findById(req.user.id);

      // Allow if admin
      if (user && user.role === "admin") {
        return next();
      }

      // Check if user owns the resource
      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      if (resourceUserId && resourceUserId === req.user.id) {
        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      console.error("Owner/admin check error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = {
  authenticateJWT,
  isAdmin,
  isOwnerOrAdmin,
};
