const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },       // e.g., "123 Main St, Apt 4B"
  city: { type: String, required: true },         // e.g., "Mumbai"
  state: { type: String, required: true },        // e.g., "Maharashtra"
  pincode: { type: String, required: true },      // e.g., "400001"
  country: { type: String, default: 'India' },    // You can make this optional or required
}, { _id: false }); // Prevents creating a separate _id for embedded schema

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  shippingAddress: { type: addressSchema, required: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
