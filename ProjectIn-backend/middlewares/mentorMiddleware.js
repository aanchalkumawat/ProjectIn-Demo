const jwt = require("jsonwebtoken");

const mentorToken = (req, res, next) => {
  console.log("🔍 Inside Mentor middleware");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token from request:", token);

  if (!token) {
    console.log("❌ Token missing after split");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Mentor Decoded Token:", decoded);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.log("⏳ Token has expired! Generating a new one...");

      // Generate a new token with 1-day expiry
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Adjust duration as needed
      );

      console.log("🔄 New Token:", newToken);
      res.setHeader("Authorization", `Bearer ${newToken}`);
      return res.status(401).json({
        message: "Token expired. A new token has been issued.",
        token: newToken,
      });
    }

    // Store user details in request
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();

  } catch (error) {
    console.error("🚨 Mentor Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = mentorToken;
