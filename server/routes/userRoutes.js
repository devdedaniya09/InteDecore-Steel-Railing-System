// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  addToCart,
  getCart,
  removeFromCart,
  updateUserProfile,
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/userAuthMiddleware');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Protected route to get user details for dashboard
router.get('/dashboard', verifyToken, getUserDetails);

// Route to add a product to wishlist
router.post('/wishlist', verifyToken, addToWishlist);

// Route to get the user's wishlist
router.get('/userwishlist', verifyToken, getWishlist);

// Route to remove a product from the wishlist
router.delete('/wishlist/:productId', verifyToken, removeFromWishlist);

// Route to add a product to the cart
router.post('/cart', verifyToken, addToCart);

// Route to get the user's cart
router.get('/usercart', verifyToken, getCart);
// Route to remove a product from the cart
router.delete('/cart/:productId', verifyToken, removeFromCart);

// Route to update user profile
router.put('/update-profile', verifyToken, updateUserProfile);


module.exports = router;
