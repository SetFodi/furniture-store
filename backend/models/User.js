// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Ensure emails are unique
      match: [
        // Basic email format validation
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Prevent password from being returned by default in queries
    },
    // --- Role Field Added ---
    role: {
      type: String,
      enum: ['user', 'admin'], // Define possible roles
      default: 'user',        // Default role for new users
    },
    // --- End Role Field ---
    // resetPasswordToken: String, // For password reset functionality
    // resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware ---

// Encrypt password using bcrypt BEFORE saving a new user
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt & hash password
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware/error handler
  }
});

// --- Mongoose Methods ---

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password of the specific user document
  // Need to explicitly select password when finding user if using this method
  return await bcrypt.compare(enteredPassword, this.password);
};

// Optional: Method to generate JWT (useful if backend handles tokens directly)
// const jwt = require('jsonwebtoken'); // Make sure to import jwt if using this
// userSchema.methods.getSignedJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '30d',
//   });
// };

module.exports = mongoose.model("User", userSchema);
