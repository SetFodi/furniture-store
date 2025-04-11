// backend/routes/admin.js
const express = require("express");
const {
  getAllUsers,
  getAllOrders,
  updateOrderToDelivered, // <<< Import controller
} = require("../controllers/admin");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect and admin middleware to all admin routes
router.use(protect, admin);

// Define specific routes
router.route("/users").get(getAllUsers);
router.route("/orders").get(getAllOrders);
router.route("/orders/:id/deliver").put(updateOrderToDelivered); // <<< Add route

// Add more admin routes later...

module.exports = router;
