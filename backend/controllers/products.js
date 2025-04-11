// backend/controllers/products.js
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Fetch all products (with filtering, sorting, and limit)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const queryFilter = {};
  let sortOptions = { createdAt: -1 }; // Default: newest first

  // Category Filtering
  if (req.query.category) {
    queryFilter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
  }

  // Price Filtering
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
     queryFilter.price = {};
     if (!isNaN(minPrice)) { queryFilter.price.$gte = minPrice; }
     if (!isNaN(maxPrice)) { queryFilter.price.$lte = maxPrice; }
  }

  // Sorting Logic
  const sortBy = req.query.sort;
  switch (sortBy) {
    case 'price_asc': sortOptions = { price: 1 }; break;
    case 'price_desc': sortOptions = { price: -1 }; break;
    case 'name_asc': sortOptions = { name: 1 }; break;
    case 'newest': default: sortOptions = { createdAt: -1 }; break;
  }

  // --- Limit Logic ---
  let limit = 0; // Default: no limit
  if (req.query.limit) {
     const parsedLimit = parseInt(req.query.limit, 10);
     if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
     }
  }
  // --- End Limit Logic ---

  console.log("API Filter:", queryFilter);
  console.log("API Sort:", sortOptions);
  console.log("API Limit:", limit); // Log limit

  // Build the query
  let query = Product.find(queryFilter).sort(sortOptions);

  // Apply limit if specified
  if (limit > 0) {
     query = query.limit(limit); // Apply the limit to the query chain
  }

  // Execute the query
  const products = await query;

  // Get total count without limit for potential pagination later (optional here)
  // const totalCount = await Product.countDocuments(queryFilter);

  res.status(200).json({
    success: true,
    count: products.length, // Count of returned products
    // total: totalCount, // Optional: total matching filter
    data: products,
  });
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
  const productData = { ...req.body };
  const product = await Product.create(productData);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error(`Product not found with id of ${productId}`); }
  product = await Product.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error(`Product not found with id of ${productId}`); }
  await Product.deleteOne({ _id: productId });
  res.status(200).json({ success: true, data: {}, message: `Product ${productId} deleted successfully` });
});
