// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const Order = require('../models/Order');

// Generate Access Token
const generateAccessToken = (admin) => {
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Register Admin
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(admin);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Logout
const logoutAdmin = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token); // Remove refresh token from storage
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get Dashboard Data (protected)
const getDashboard = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');  // Do not include password

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ 
      message: 'Dashboard data fetched successfully',
      admin,  // This includes the dateCreated field
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Available Employees
const getAvailableEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isApproved: true, isAvailable: true });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// Admin Approval of Employee
const approveEmployee = async (req, res) => {
  try {
    const { employeeId, status } = req.body;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(400).json({ message: "Employee not found." });
    }

    employee.isApproved = status;
    await employee.save();

    res.json({ message: status ? "Employee approved successfully." : "Employee marked as unauthorized." });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee status.", error: err.message });
  }
};

// assignOrderToEmployee
const assignOrderToEmployee = async (req, res) => {
  const { orderId, employeeId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (!employee.isAvailable) {
      return res.status(400).json({ message: 'This employee is currently not available' });
    }

    order.assignedEmployee = employeeId;
    await order.save();

    employee.isAvailable = false;
    await employee.save();

    res.json({ message: 'Order assigned successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign order', error });
  }
};


const updateOrderNotes = async (req, res) => {
  const { orderId, notes } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.notes = notes || 'NA';
    await order.save();

    res.status(200).json({ message: 'Notes updated successfully', order });
  } catch (error) {
    console.error("Failed to update notes:", error);
    res.status(500).json({ message: "Failed to update notes", error });
  }
};

// GET /api/admin/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee details', error: err.message });
  }
};

const sendNotificationToEmployee = async (req, res) => {
  try {
    const { employeeId, message, type } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const newNotification = {
      message,
      type: type || 'info',
      date: new Date(),
      read: false,
    };

    employee.notifications.unshift(newNotification);
    await employee.save();

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};

const revokeEmployee = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if an employee is assigned
    if (order.assignedEmployee) {
      const employee = await Employee.findById(order.assignedEmployee);
      if (!employee) {
        return res.status(404).json({ message: "Assigned employee not found" });
      }

      // Set employee's availability back to true
      employee.isAvailable = true;
      await employee.save();
    }

    // Revoke the employee from the order
    order.assignedEmployee = null;
    await order.save();

    res.status(200).json({ message: "Assigned employee revoked successfully", order });
  } catch (error) {
    console.error("Error revoking employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/orders/:orderId/notification
const sendOrderNotification = async (req, res) => {
  const { orderId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Notification message is required' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.notifications.push({ message });
    await order.save();

    res.status(200).json({ message: 'Notification added successfully!' });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { 
  registerAdmin, 
  loginAdmin, 
  getDashboard,
  getAvailableEmployees,
  assignOrderToEmployee,
  logoutAdmin , approveEmployee , updateOrderNotes , getEmployeeById , sendNotificationToEmployee , revokeEmployee ,sendOrderNotification
};
