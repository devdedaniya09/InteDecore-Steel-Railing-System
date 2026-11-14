const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");  // Your MongoDB connection
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from the frontend URL
  credentials: true, // Allow credentials (cookies, Authorization headers)
};

// Apply CORS middleware with the above options
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Serve static files (product images) from the 'product_image' directory
app.use("/product_image", express.static(path.join(__dirname, "product_image")));

// MongoDB connection
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/employees', employeeRoutes);

// Listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
