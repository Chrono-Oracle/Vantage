const jwt = require("jsonwebtoken");

// Use the secret from .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    // Explicitly pass the secret here
    const decoded = jwt.verify(token, JWT_SECRET);
    return { error: false, decoded };
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return { error: true, message: error.message };
  }
};

module.exports = { generateToken, verifyToken, JWT_SECRET };
