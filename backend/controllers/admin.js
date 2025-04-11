// backend/controllers/admin.js
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  // Find all orders and populate the 'user' field with their id and name
  // Sort by creation date, newest first
  const orders = await Order.find({})
    .populate("user", "id name email") // Select which user fields to include
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
  
    const order = await Order.findById(orderId);
  
    if (!order) {
      res.status(404);
      throw new Error(`Order not found with ID: ${orderId}`);
    }
  
    // Check if already delivered
    if (order.isDelivered) {
       res.status(400); // Bad request
       throw new Error("Order is already marked as delivered");
    }
  
    // Update status
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  
    // Optionally: Add logic here if payment needs to be confirmed before delivery
    // if (!order.isPaid) {
    //   res.status(400);
    //   throw new Error("Order must be paid before marking as delivered");
    // }
  
    const updatedOrder = await order.save();
  
    res.status(200).json({
      success: true,
      data: updatedOrder, // Send back the updated order
    });
  });
  
// Add more admin functions later...
// exports.updateOrderStatus = asyncHandler(async (req, res, next) => { ... });
// exports.deleteUser = asyncHandler(async (req, res, next) => { ... });
