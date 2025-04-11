// backend/routes/orders.js
const express = require("express");
const { addOrderItems, getMyOrders } = require("../controllers/orders");
const { protect } = require("../middleware/authMiddleware"); // Import protect

const router = express.Router();

// Apply protect middleware
router.route("/").post(protect, addOrderItems); // Requires login
router.route("/myorders").get(protect, getMyOrders); // Requires login

// Add route for getting single order by ID later if needed
// router.route('/:id').get(protect, getOrderById);

module.exports = router;
