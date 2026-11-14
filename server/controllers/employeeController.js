const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Order = require('../models/Order');

// Employee Sign Up
const signupEmployee = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, dob, address } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      dob,
      address
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee signed up successfully! Waiting for admin approval." });
  } catch (err) {
    res.status(500).json({ message: "Error signing up employee.", error: err.message });
  }
};

// Employee Login
const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ✅ Check if employee is approved
    if (!employee.isApproved) {
      return res.status(403).json({ message: 'Your account is not approved yet. Please wait for admin approval.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: employee._id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};



// Get all employees (Protected Route)
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: "Error fetching employees." });
    }
};


const getEmployeeDetails = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(400).json({ message: "Employee not found." });
    }

    const { password, notifications, ...employeeData } = employee.toObject();
    res.json({ ...employeeData, notifications });  // Include notifications in the response
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee details.", error: err.message });
  }
};



// EmployeeController.js
const getEmployeeOrders = async (req, res) => {
  try {
    const employeeId = req.user.id; // Get logged-in employee's ID from JWT
    const orders = await Order.find({ assignedEmployee: employeeId })
      .populate('user', 'name email') // Populate user details
      .exec();

    res.json(orders);
  } catch (err) {
    console.error("Error fetching employee orders:", err);
    res.status(500).json({ message: "Error fetching orders.", error: err.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const employeeId = req.user.id;

    const order = await Order.findOne({ _id: orderId, assignedEmployee: employeeId });

    if (!order) {
      return res.status(403).json({ message: "Unauthorized or order not found" });
    }

    // Push the new status change to the statusHistory
    order.status = status;
    order.statusHistory.push({ status, updatedAt: new Date() });

    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};

  const updatePaymentStatus = async (req, res) => {
    try {
      const { orderId, paymentStatus } = req.body;
      const employeeId = req.user.id;
  
      const order = await Order.findOne({ _id: orderId, assignedEmployee: employeeId });
      if (!order) {
        return res.status(403).json({ message: "Unauthorized or order not found" });
      }
  
      order.paymentStatus = paymentStatus;
      await order.save();
  
      res.json({ message: "Payment status updated successfully", order });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Error updating payment status", error });
    }
  };

// Backend: Employee Controller
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const employeeId = req.user.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found.' });
    }

    const notification = employee.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.read = true;  // Mark as read
    await employee.save();

    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};


// Backend: Employee Controller
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const employeeId = req.user.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found.' });
    }

    const notificationIndex = employee.notifications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    employee.notifications.splice(notificationIndex, 1);  // Remove the notification
    await employee.save();

    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

const updateEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const updateFields = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', employee: updatedEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};


module.exports = {
  getEmployees,
  loginEmployee,
  signupEmployee,
  getEmployeeDetails,
  getEmployeeOrders,
  updateOrderStatus,
  updatePaymentStatus, markNotificationAsRead , deleteNotification , updateEmployeeProfile
};
