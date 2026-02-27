const { verifyToken, JWT_SECRET } = require("../lib/jwt.lib");

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
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
    const decoded = verifyToken(token, JWT_SECRET);

    if (decoded.error) {
      return res.status(401).json({
        error: true,
        message: "Invalid or expired token.",
      });
    }

    // Attach user info to request
    req.user = result.decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Authentication failed.",
    });
  }
};

module.exports = authMiddleware;
