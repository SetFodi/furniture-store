// backend/controllers/orders.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Protected by middleware)
exports.addOrderItems = asyncHandler(async (req, res, next) => {
  // Get userId from req.user (set by protect middleware)
  const userId = req.user._id; // <<< Use req.user

  // Destructure other fields from req.body
  const {
    orderItems,
    shippingAddress,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Basic validation
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
    const productDB = productsFromDB.find(
      (p) => p._id.toString() === itemClient.product
    );
    if (!productDB) {
      throw new Error(`Product not found: ID ${itemClient.product}`);
    }
    if (productDB.stock < itemClient.quantity) {
      throw new Error(
        `Not enough stock for ${productDB.name}. Available: ${productDB.stock}, Requested: ${itemClient.quantity}`
      );
    }
    calculatedSubtotal += productDB.price * itemClient.quantity;
    return {
      ...itemClient,
      price: productDB.price,
      product: productDB._id,
    };
  });
  // --- End Validation ---

  // Create the order object
  const order = new Order({
    user: userId, // <<< Assign userId from req.user
    orderItems: validatedOrderItems,
    shippingAddress,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: true, // Simulation
    paidAt: Date.now(), // Simulation
  });

  const createdOrder = await order.save();

  // --- Update Product Stock ---
  const stockUpdatePromises = createdOrder.orderItems.map(async (item) => {
    return Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  });
  await Promise.all(stockUpdatePromises);
  // --- End Stock Update ---

  res.status(201).json({
    success: true,
    data: createdOrder,
  });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Protected by middleware)
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  // Get userId reliably from req.user (set by protect middleware)
  const userId = req.user._id; // <<< Use req.user

  // Find orders for the authenticated user
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const userId = req.user._id; // From protect middleware
  
    // Find the order by its ID and also populate the user field (name and email)
    // We use populate to get user details instead of just the ID
    const order = await Order.findById(orderId); //.populate('user', 'name email'); // Populate later if needed
  
    if (!order) {
      res.status(404);
      throw new Error(`Order not found with ID: ${orderId}`);
    }
  
    // Authorization Check: Ensure the logged-in user owns the order
    // (Or implement admin role check later: || req.user.role === 'admin')
    if (order.user.toString() !== userId.toString()) {
      res.status(401); // Unauthorized
      throw new Error("Not authorized to view this order");
    }
  
    res.status(200).json({
      success: true,
      data: order,
    });
  });