const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  shippingAddress: {
  fullName: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: String
},
totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Pending' },  // Current order status
  paymentStatus: { type: String, default: 'Unpaid' },
  createdAt: { type: Date, default: Date.now },
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },

  // ✅ New field: history of all status changes
  statusHistory: [
    {
      status: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now },
    }
  ],

  notes: {
    type: String,
    default: 'N/A',
  },

  notifications: [
    {
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }, // To track if the user has seen it
    }
  ],
  
});

module.exports = mongoose.model('Order', orderSchema);
