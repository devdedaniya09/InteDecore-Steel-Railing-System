const Product = require("../models/Product");
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

// Add Product (Admins Only)
const addProduct = async (req, res) => {
  await body('name').notEmpty().withMessage('Product name is required').run(req);
  await body('description').notEmpty().withMessage('Product description is required').run(req);
  await body('price').isFloat({ min: 0 }).withMessage('Product price should be a positive number').run(req);
  await body('category').notEmpty().withMessage('Product category is required').run(req);
  await body('availability').isBoolean().withMessage('Availability should be true or false').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, availability } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    if (images.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const newProduct = new Product({ name, description, price, category, availability, images });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Products (Authenticated Users) with Optional Availability Filter
const getProducts = async (req, res) => {
  try {
    const { availability } = req.query;  // Get availability filter from query params
    const query = availability ? { availability: availability === 'true' } : {}; // Only filter if availability is provided

    const products = await Product.find(query); // Use the query to filter products

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Fetch Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Assuming your product schema has an images field as an array of filenames
    const productWithImageUrl = {
      ...product.toObject(),
      images: product.images.map(image => `/product_image/${image}`), // Add the full URL
    };

    res.json(productWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Update Product (Admins Only)
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, category, availability } = req.body;
  const newImages = req.files ? req.files.map(file => file.filename) : [];

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.availability = availability || product.availability;

    if (newImages.length > 0) {
      product.images.forEach(image => {
        const imagePath = path.join(__dirname, '../product_image', image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      });

      product.images = newImages;
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete Product (Admins Only)
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.images.forEach(image => {
      const imagePath = path.join(__dirname, '../product_image', image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    });

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct };
