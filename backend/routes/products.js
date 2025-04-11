// backend/routes/products.js
const express = require("express");
const {
  getProducts,
  getProductById,
} = require("../controllers/products");

const router = express.Router();

// Route for getting all products
router.route("/").get(getProducts);

// Route for getting a single product by ID
router.route("/:id").get(getProductById);

module.exports = router;
