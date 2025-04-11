// backend/controllers/auth.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400); throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); throw new Error("User already exists with that email");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      // Note: Role will be 'user' by default based on your schema
      role: user.role, // Include role even on register if needed elsewhere
    },
  });
});

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401); throw new Error("Please provide email and password");
  }

  // Fetch user including password AND role
  const user = await User.findOne({ email }).select("+password"); // Role is selected by default

  if (!user) {
    res.status(401); throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401); throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  // --- Prepare Response Data ---
  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // <<< Include the user's role here
  };

  // Optional: Log before sending
  // console.log("--- Backend Login Response ---");
  // console.log("User Data Sent:", responseData);
  // console.log("Token Sent:", token);

  res.status(200).json({
    success: true,
    token: token,
    data: responseData, // Send data including the role
  });
});
