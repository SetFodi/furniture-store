// backend/controllers/products.js
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Add pagination/filtering later if needed
  const products = await Product.find({});
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404); throw new Error(`Product not found with id of ${req.params.id}`);
  }
  res.status(200).json({ success: true, data: product });
});

// --- Admin Product Controllers ---

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Basic product creation, assumes necessary fields are in req.body
  // Add validation as needed
  const productData = { ...req.body };
  // Optionally set createdBy user: productData.user = req.user._id;

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error(`Product not found with id of ${productId}`);
  }

  // Update product fields from req.body
  // Add validation as needed
  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true, // Return the modified document
    runValidators: true, // Run schema validators on update
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error(`Product not found with id of ${productId}`);
  }

  // Use deleteOne() or findByIdAndDelete()
  await Product.deleteOne({ _id: productId });
  // Or: await product.remove(); // Mongoose < v7
  // Or: await Product.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    data: {}, // Send empty object on successful deletion
    message: `Product ${productId} deleted successfully`,
  });
});
