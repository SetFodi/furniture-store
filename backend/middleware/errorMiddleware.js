// backend/middleware/errorMiddleware.js

// Handle Not Found errors (404)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next middleware (errorHandler)
  };
  
  // General error handler
  const errorHandler = (err, req, res, next) => {
    // Sometimes errors might come with a status code, otherwise default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    res.json({
      message: err.message,
      // Provide stack trace only in development mode
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };
  