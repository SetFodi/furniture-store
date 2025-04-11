// backend/controllers/orders.js
const mongoose = require('mongoose'); // <<< Added Mongoose require
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Protected by middleware)
exports.addOrderItems = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { orderItems, shippingAddress, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400); throw new Error("No order items provided");
  }
  if (!shippingAddress) {
    res.status(400); throw new Error("Shipping address is required");
  }

  // --- Server-side validation & Stock Check ---
  let calculatedSubtotal = 0;
  const itemIds = orderItems.map((item) => item.product);
  const productsFromDB = await Product.find({ _id: { $in: itemIds } });
  const validatedOrderItems = orderItems.map((itemClient) => {
    const productDB = productsFromDB.find((p) => p._id.toString() === itemClient.product);
    if (!productDB) { throw new Error(`Product not found: ID ${itemClient.product}`); }
    if (productDB.stock < itemClient.quantity) { throw new Error(`Not enough stock for ${productDB.name}. Available: ${productDB.stock}, Requested: ${itemClient.quantity}`); }
    calculatedSubtotal += productDB.price * itemClient.quantity;
    return { ...itemClient, price: productDB.price, product: productDB._id };
  });
  // --- End Validation ---

  const order = new Order({
    user: userId,
    orderItems: validatedOrderItems,
    shippingAddress,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
  });
  const createdOrder = await order.save();

  // --- Update Product Stock ---
  const stockUpdatePromises = createdOrder.orderItems.map(async (item) => {
    return Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  });
  await Promise.all(stockUpdatePromises);
  // --- End Stock Update ---

  res.status(201).json({ success: true, data: createdOrder });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Protected by middleware)
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const requestingUser = req.user; // User from protect middleware

  // Optional: Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
     res.status(400);
     throw new Error(`Invalid Order ID format: ${orderId}`);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error(`Order not found with ID: ${orderId}`);
  }

  // --- Corrected Authorization Check ---
  // Check if the order has a user field AND if that user matches the request OR if the request user is admin
  const isOwner = order.user && order.user.toString() === requestingUser._id.toString(); // Safely check order.user first
  const isAdmin = requestingUser.role === 'admin';

  if (!isOwner && !isAdmin) { // Deny access if NOT owner AND NOT admin
    res.status(401); // Unauthorized
    throw new Error("Not authorized to view this order");
  }
  // --- End Correction ---

  // If the check passes, return the order
  res.status(200).json({
    success: true,
    data: order,
  });
});
