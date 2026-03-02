const { verifyToken } = require("../lib/jwt.lib");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const result = verifyToken(token); // Use the lib function which knows the secret

  if (result.error) {
    return res.status(401).json({ error: true, message: result.message });
  }

  req.user = result.decoded;-
  next();
};

module.exports = authMiddleware;