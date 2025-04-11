// backend/routes/orders.js
const express = require("express");
const {
  addOrderItems,
  getMyOrders,
  getOrderById, // <<< Import getOrderById
} = require("../controllers/orders");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware
router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById); // <<< Add route for single order

module.exports = router;
