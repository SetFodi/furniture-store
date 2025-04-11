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
  // Optional: Check for token in cookies if you plan to use them
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized, no token provided");
  }

  try {
    // Verify token using the backend's JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload and attach to request
    // Exclude password field from being attached
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      // Handle case where user associated with token no longer exists
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401); // Unauthorized
    throw new Error("Not authorized, token failed verification");
  }
});

// --- Admin Authorization Middleware Added ---
// Middleware to authorize based on admin role
exports.admin = (req, res, next) => {
  // Assumes 'protect' middleware has already run and attached req.user
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    res.status(403); // Forbidden
    throw new Error("Not authorized as an admin");
  }
};
// --- End Admin Middleware ---
