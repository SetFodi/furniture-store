// backend/controllers/auth.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Basic validation (Mongoose validation will also run)
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error("User already exists with that email");
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // Don't send password back, even hashed (though it's excluded by `select: false` anyway)
  // We might send back a token here if not using NextAuth exclusively for sessions
  // For now, just send back basic user info (excluding password)

  res.status(201).json({
    success: true,
    // You might send back a token here if needed: token: user.getSignedJwtToken(),
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

// --- Login Controller (Example - Might be replaced/adapted for NextAuth) ---
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password were provided
  if (!email || !password) {
    res.status(401); // Unauthorized
    throw new Error("Please provide email and password");
  }

  // Check for user
  // Explicitly select password as it's excluded by default
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401); // Unauthorized
    throw new Error("Invalid credentials"); // Generic error
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401); // Unauthorized
    throw new Error("Invalid credentials"); // Generic error
  }

  // If using backend tokens: sendTokenResponse(user, 200, res);
  // For NextAuth Credentials provider, we might just return user data
  res.status(200).json({
    success: true,
    // token: user.getSignedJwtToken(), // Example if sending token
    data: {
      // Send data NextAuth might need
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// --- Helper for sending token (Example if needed) ---
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = user.getSignedJwtToken();
//   const options = {
//     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//     httpOnly: true, // Prevent access from JS
//   };
//   if (process.env.NODE_ENV === 'production') {
//     options.secure = true; // Only send over HTTPS
//   }
//   res.status(statusCode)
//     .cookie('token', token, options) // Set cookie (optional)
//     .json({ success: true, token, data: { _id: user._id, name: user.name, email: user.email } });
// };
