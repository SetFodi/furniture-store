// backend/seeder.js
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config(); // Make sure this points to your .env file if seeder.js is not in the root

// Load models
const Product = require("./models/Product");
// Add other models here if you create them (e.g., User, Order)

// Load sample data
const products = require("./_data/products");

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Import data into DB
const importData = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    // Add other model deleteMany() calls here if needed
    console.log("Data Destroyed...");

    await Product.create(products);
    // Add other model create() calls here if needed
    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error("Error importing data:", err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    // Add other model deleteMany() calls here if needed
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error("Error deleting data:", err);
    process.exit(1);
  }
};

// Check for command line arguments
if (process.argv[2] === "-i") {
  // node seeder.js -i
  importData();
} else if (process.argv[2] === "-d") {
  // node seeder.js -d
  deleteData();
} else {
  console.log(
    "Please use the -i flag to import data or -d flag to delete data."
  );
  process.exit();
}
