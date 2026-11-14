const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/empAuthToken'); // Import your authentication middleware
const {
  signupEmployee,
  loginEmployee,
  getEmployees,
  getEmployeeDetails,
  getEmployeeOrders,
  updateOrderStatus,
  updatePaymentStatus, markNotificationAsRead , deleteNotification , updateEmployeeProfile , 
} = require('../controllers/employeeController');

// Employee Sign Up Route
router.post('/signup', signupEmployee);

// Employee Login Route
router.post('/login', loginEmployee);


// Get all employees (Admin only)
router.get('/employees', authenticate, getEmployees);

// Get employee profile details (protected)
router.get("/profile", authenticate, getEmployeeDetails);

// Get all orders assigned to the logged-in employee (protected)
router.get('/orders', authenticate, getEmployeeOrders);

// Update Order Status (protected)
router.put('/orders/status', authenticate, updateOrderStatus);

// Update Payment Status (protected)
router.put('/orders/payment-status', authenticate, updatePaymentStatus);

// Routes for notifications
router.put('/notifications/read', authenticate, markNotificationAsRead);
router.delete('/notifications/:notificationId', authenticate, deleteNotification);

router.put('/profile/update', authenticate, updateEmployeeProfile);
module.exports = router;
 