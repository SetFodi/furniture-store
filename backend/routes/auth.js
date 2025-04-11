// backend/routes/auth.js
const express = require("express");
const { register, login } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // Keep for now, may adapt for NextAuth

module.exports = router;
