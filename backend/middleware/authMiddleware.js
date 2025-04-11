// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

// Protect routes - Verify token and attach user
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    // Verify token using the backend's JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload and attach to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    next(); // Proceed
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401);
    throw new Error("Not authorized, token failed verification");
  }
});

// Optional: Middleware to authorize based on roles
// exports.authorize = (...roles) => { ... };
