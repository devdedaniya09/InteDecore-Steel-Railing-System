const express = require('express');
const { 
  registerAdmin, 
  loginAdmin, 
  getDashboard, 
  getAvailableEmployees, 
  assignOrderToEmployee ,
  approveEmployee,
  logoutAdmin ,updateOrderNotes ,getEmployeeById , sendNotificationToEmployee , revokeEmployee,sendOrderNotification
} = require('../controllers/adminController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

// Register Admin
router.post('/register', registerAdmin);

// Admin Login
router.post('/login', loginAdmin);

// Admin Dashboard (protected)
router.get('/dashboard', verifyAdminToken, getDashboard);

// Get Available Employees
router.get('/getAvailableEmployees', verifyAdminToken,getAvailableEmployees);

// ✅ FIXED: Changed to POST
router.post('/assignOrderToEmployee', verifyAdminToken, assignOrderToEmployee);

// Admin Approval of Employee Route
router.put('/approve', verifyAdminToken, approveEmployee);

router.put('/updateOrderNotes', verifyAdminToken, updateOrderNotes);

router.get('/employees/:id', verifyAdminToken, getEmployeeById);

router.post('/sendNotification', verifyAdminToken, sendNotificationToEmployee);

router.put('/orders/:id/revoke', verifyAdminToken, revokeEmployee);

router.post('/orders/:orderId/notification', verifyAdminToken, sendOrderNotification);


router.post('/logout', logoutAdmin);

module.exports = router;
