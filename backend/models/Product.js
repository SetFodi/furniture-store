// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["Living Room", "Bedroom", "Dining", "Office", "Outdoor"], // Example categories
    },
    material: {
      type: String,
      // Example: Wood, Metal, Fabric, Leather, Plastic
    },
    dimensions: {
      // Optional detailed dimensions
      width: Number,
      height: Number,
      depth: Number,
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
      // We'll use placeholder URLs initially
    },
    images: [
      // Optional: Array for multiple images (gallery)
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },
    rating: {
      // Optional: Average rating
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      // Optional: Number of reviews
      type: Number,
      default: 0,
    },
    // Add other relevant fields like color options, brand, etc. if needed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("Product", productSchema);
