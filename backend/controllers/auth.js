// backend/controllers/auth.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken

// --- Helper to generate JWT signed with backend secret ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d", // Use env variable or default
  });
};
// --- End Helper ---

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with that email");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token for the newly registered user (optional, depends on flow)
  // const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    // token: token, // Optionally send token immediately after registration
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // If credentials are valid, generate and return backend JWT
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token: token, // <<< Return the backend-generated JWT
    data: {
      // Send user data needed by NextAuth authorize
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
