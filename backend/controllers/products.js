// backend/controllers/products.js
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler"); // We'll create this helper next

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Basic fetching for now. We can add filtering, pagination later.
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    // Basic error handling
    res.status(404);
    throw new Error(`Product not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// We will add more controller functions later (create, update, delete)
