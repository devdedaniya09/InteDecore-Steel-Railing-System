const express = require('express');
const multer = require('multer');
const path = require('path');  // <-- Add this line
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product_image'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file name
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();  // <-- Using path here
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false);
    }
    cb(null, true);
  }
});

// Define routes
router.post('/add', upload.array('images'), addProduct); // Handle multiple images
router.get('/', getProducts); // Fetch products
router.get('/:productId', getProductById);  // Fetch product by ID
router.put('/edit/:productId', upload.array('images'), updateProduct); // Handle multiple image upload
router.delete('/:productId', deleteProduct);

module.exports = router;
