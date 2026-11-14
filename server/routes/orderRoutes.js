const express = require('express');
const { placeOrder, getUserOrders ,getAllOrders ,getOrderById , getOrderNotifications , getMonthlySalesSummary , markNotificationAsRead , downloadInvoice} = require('../controllers/orderController');
const { verifyToken } = require('../middleware/userAuthMiddleware');

const router = express.Router();

router.post('/placeorder', verifyToken, placeOrder);
router.get('/userorders', verifyToken, getUserOrders);
router.get('/orders', getAllOrders); // Fetch all orders for admin
router.get('/orders/:orderId', getOrderById); // Fetch all orders for admin
router.get('/notifications', verifyToken, getOrderNotifications);
router.get('/admin/sales-summary', verifyToken, getMonthlySalesSummary);
router.put('/notifications/:id/read', verifyToken, markNotificationAsRead);
router.get('/orders/invoice/:orderId', verifyToken, downloadInvoice);
module.exports = router;