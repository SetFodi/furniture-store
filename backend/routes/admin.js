// backend/routes/admin.js
const express = require("express");
const {
  getAllUsers,
  getAllOrders,
  updateOrderToDelivered,
} = require("../controllers/admin");
// Import product controllers (assuming they are now in controllers/products.js)
const {
   createProduct,
   updateProduct,
   deleteProduct
} = require('../controllers/products'); // <<< Import product CRUD controllers
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect and admin middleware to all admin routes
router.use(protect, admin);

// User Routes
router.route("/users").get(getAllUsers);
// router.route('/users/:id').delete(deleteUser); // Add later

// Order Routes
router.route("/orders").get(getAllOrders);
router.route("/orders/:id/deliver").put(updateOrderToDelivered);

// Product Routes (Admin)
router.route("/products").post(createProduct); // <<< Add POST route
router.route("/products/:id")
    .put(updateProduct)     // <<< Add PUT route
    .delete(deleteProduct); // <<< Add DELETE route

module.exports = router;
