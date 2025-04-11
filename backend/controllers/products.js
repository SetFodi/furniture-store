// backend/controllers/products.js
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Fetch all products (with filtering and sorting)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const queryFilter = {}; // For category, price etc.
  let sortOptions = { createdAt: -1 }; // Default sort: newest first

  // --- Category Filtering ---
  if (req.query.category) {
    queryFilter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
  }

  // --- Price Filtering (Example - Add more robust parsing/validation later) ---
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
     queryFilter.price = {};
     if (!isNaN(minPrice)) {
        queryFilter.price.$gte = minPrice; // Greater than or equal to minPrice
     }
     if (!isNaN(maxPrice)) {
        queryFilter.price.$lte = maxPrice; // Less than or equal to maxPrice
     }
  }
  // --- End Price Filtering ---


  // --- Sorting Logic ---
  const sortBy = req.query.sort;
  switch (sortBy) {
    case 'price_asc':
      sortOptions = { price: 1 }; // 1 for ascending
      break;
    case 'price_desc':
      sortOptions = { price: -1 }; // -1 for descending
      break;
    case 'name_asc': // Optional: Sort by name A-Z
      sortOptions = { name: 1 };
      break;
    case 'newest':
    default:
      sortOptions = { createdAt: -1 }; // Default
      break;
  }
  // --- End Sorting Logic ---

  console.log("API Filter:", queryFilter); // Log filter
  console.log("API Sort:", sortOptions); // Log sort

  // Apply filter and sort options
  const products = await Product.find(queryFilter).sort(sortOptions);

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
