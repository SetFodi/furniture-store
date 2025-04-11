// backend/controllers/orders.js
const Order = require("../models/Order");
const Product = require("../models/Product"); // Need Product model for stock updates
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (for now, should be Private/User later)
exports.addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems, // Array of { product (ID), name, quantity, imageUrl, price }
    shippingAddress, // Object with address details
    taxPrice,
    shippingPrice,
    totalPrice,
    // paymentMethod, // Add if needed
  } = req.body;

  // Basic validation
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  // --- Optional: Server-side validation & Stock Check ---
  // It's safer to re-validate prices and check stock on the server
  // to prevent manipulation on the client-side.
  let calculatedSubtotal = 0;
  const itemIds = orderItems.map((item) => item.product); // Get product IDs
  const productsFromDB = await Product.find({ _id: { $in: itemIds } });

  const validatedOrderItems = orderItems.map((itemClient) => {
    const productDB = productsFromDB.find(
      (p) => p._id.toString() === itemClient.product // Find matching product from DB
    );
    if (!productDB) {
      throw new Error(`Product not found: ID ${itemClient.product}`);
    }
    if (productDB.stock < itemClient.quantity) {
      throw new Error(
        `Not enough stock for ${productDB.name}. Available: ${productDB.stock}, Requested: ${itemClient.quantity}`
      );
    }
    // Use DB price for calculation to be safe
    calculatedSubtotal += productDB.price * itemClient.quantity;
    return {
      ...itemClient, // Keep client name, quantity, image
      price: productDB.price, // Use DB price
      product: productDB._id, // Ensure it's the ObjectId
    };
  });

  // Optional: Recalculate tax/shipping/total on server if needed, or trust client for now
  // const serverCalculatedTax = calculatedSubtotal * 0.08; // Example
  // const serverCalculatedShipping = calculatedSubtotal > 100 ? 0 : 15; // Example
  // const serverCalculatedTotal = calculatedSubtotal + serverCalculatedTax + serverCalculatedShipping;
  // --- End Optional Validation ---

  // Create the order object
  const order = new Order({
    orderItems: validatedOrderItems, // Use validated items
    // user: req.user._id, // Add this when auth is implemented
    shippingAddress,
    taxPrice, // Using client-provided for now
    shippingPrice, // Using client-provided for now
    totalPrice, // Using client-provided for now
    // paymentMethod,
    isPaid: true, // Simulation
    paidAt: Date.now(), // Simulation
  });

  const createdOrder = await order.save();

  // --- Update Product Stock ---
  // Important: Decrease stock count for ordered items
  const stockUpdatePromises = createdOrder.orderItems.map(async (item) => {
    return Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }, // Decrement stock by quantity ordered
    });
  });
  await Promise.all(stockUpdatePromises);
  // --- End Stock Update ---

  res.status(201).json({
    success: true,
    data: createdOrder,
  });
});

// Add other controller functions later (getOrderById, getUserOrders, etc.)
