// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // If implementing users later, add:
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String, required: true }, // Store image for order history display
        price: { type: Number, required: true }, // Price at the time of order
        product: {
          // Reference to the original product
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true }, // Added name field
      email: { type: String, required: true }, // Added email field
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // Add payment details later if needed (e.g., payment method, payment result)
    // paymentMethod: {
    //   type: String,
    //   required: true,
    //   default: 'Simulated',
    // },
    // paymentResult: { ... }
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      // For simulated payment
      type: Boolean,
      required: true,
      default: true, // Assume paid in simulation
    },
    paidAt: {
      // Set when actually paid
      type: Date,
      default: Date.now, // Set immediately in simulation
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
