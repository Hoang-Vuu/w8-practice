require('dotenv').config();
const express = require("express");
const app = express();
const propertyRouter = require("./routes/propertyRouter"); // import propertyRouter
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the propertyRouter for all "/properties" routes
app.use("/api/properties", propertyRouter);

// Handle unknown endpoints
app.use(unknownEndpoint);

// Handle errors
app.use(errorHandler);

module.exports = app;

// Uncomment this if you want to run the server directly
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
