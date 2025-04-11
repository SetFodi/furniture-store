// backend/routes/orders.js
const express = require("express");
const { addOrderItems } = require("../controllers/orders");
// const { protect } = require('../middleware/authMiddleware'); // Add later for user auth

const router = express.Router();

// Route for creating an order
// Add protect middleware later: router.route('/').post(protect, addOrderItems);
router.route("/").post(addOrderItems);

// Add routes for getting orders later (e.g., /:id, /myorders)

module.exports = router;
