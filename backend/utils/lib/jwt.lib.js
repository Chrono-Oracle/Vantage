const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

const verifyToken = (token) => {
  try {
    return {
      error: false,
      decoded: jwt.verify(token, JWT_SECRET),
    };
  } catch (error) {
    return {
      error: true,
      message: error.message || "Invalid token",
    };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
