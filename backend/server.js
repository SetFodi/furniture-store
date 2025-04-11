// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/products"); // Import product routes
const { notFound, errorHandler } = require("./middleware/errorMiddleware"); // Import error middleware (we'll create this)

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Simple Route for Testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount Routers
app.use("/api/products", productRoutes); // Use product routes

// Error Handling Middleware (Should be after routes)
// We need to create these middleware functions
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
