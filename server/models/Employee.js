// models/Employee.js
const mongoose = require('mongoose');

// Define notification schema separately for clarity
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' }
});

const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  notifications: [notificationSchema] // 💡 Modular & extensible
});

module.exports = mongoose.model('Employee', employeeSchema);
