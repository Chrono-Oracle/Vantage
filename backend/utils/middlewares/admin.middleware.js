const { verifyToken } = require("../lib/jwt.lib");

/**
 * Admin middleware
 * Verifies JWT token AND checks if user has admin role
 * Use this middleware to protect admin-only routes
 */
const adminMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const result = verifyToken(token);

    if (result.error) {
      return res.status(401).json({
        error: true,
        message: "Invalid or expired token.",
      });
    }

    // Check if user is admin
    if (result.decoded.role !== "admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Attach user info to request
    req.user = result.decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Authorization failed.",
    });
  }
};

module.exports = adminMiddleware;
