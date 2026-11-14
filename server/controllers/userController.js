const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, shippingAddress, mobile } = req.body;

  try {
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: 'Name, email, password, and mobile are required.' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ message: 'Complete shipping address is required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      shippingAddress,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get User Details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      shippingAddress: user.shippingAddress,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details.' });
  }
};

// Wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist.' });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: 'Product added to wishlist successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      return res.status(400).json({ message: 'Product not in wishlist.' });
    }

    user.wishlist.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Product removed from wishlist.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Cart
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: 'Product already in cart.' });
    }

    user.cart.push(productId);
    await user.save();

    res.status(200).json({ message: 'Product added to cart successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('cart');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const cartItems = user.cart.map(item => ({
      ...item.toObject(),
      quantity: 1,
    }));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({ cart: cartItems, totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart.', error });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const index = user.cart.indexOf(productId);
    if (index === -1) {
      return res.status(400).json({ message: 'Product not in cart.' });
    }

    user.cart.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Product removed from cart.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { name, email, shippingAddress, mobile } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    if (shippingAddress) {
      user.shippingAddress.street = shippingAddress.street || user.shippingAddress.street;
      user.shippingAddress.city = shippingAddress.city || user.shippingAddress.city;
      user.shippingAddress.state = shippingAddress.state || user.shippingAddress.state;
      user.shippingAddress.pincode = shippingAddress.pincode || user.shippingAddress.pincode;
      user.shippingAddress.country = shippingAddress.country || user.shippingAddress.country;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
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
};
