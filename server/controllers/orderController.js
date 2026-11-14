const Order = require('../models/Order');
const User = require('../models/User');

const placeOrder = async (req, res) => {
  const { paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('cart');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = user.cart.reduce((sum, item) => sum + item.price, 0);

    const newOrder = new Order({
      user: userId,
      items: user.cart.map(product => ({ product: product._id, quantity: 1 })),
      shippingAddress: user.shippingAddress,
      totalPrice,
      paymentMethod
    });

    await newOrder.save();
    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price images'); // Ensure 'images' is included

    if (!orders.length) return res.status(404).json({ message: 'No orders found' });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select('user shippingAddress totalPrice createdAt status paymentStatus assignedEmployee statusHistory')  // Include statusHistory
      .populate('user', 'name email')
      .populate('assignedEmployee', 'firstName lastName email')
      .populate('items.product', 'name price images'); // Ensure product fields are populated

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


// Get Single Order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('assignedEmployee', 'firstName lastName email')
      .populate('items.product', 'name price images description')

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

const getOrderNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch orders for the logged-in user and their notifications
    const orders = await Order.find({ user: userId }).select('notifications');

    // Flatten notifications from all orders
    const notifications = orders.flatMap(order => order.notifications);

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications.', error });
  }
};
// Get Monthly Sales Summary for Admin
const getMonthlySalesSummary = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error getting monthly sales summary:", error);
    res.status(500).json({ message: "Failed to fetch summary", error });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Find the order that has the notification with the given ID
    const order = await Order.findOne({ user: userId, "notifications._id": id });

    if (!order) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Update the specific notification's 'read' field to true
    const notif = order.notifications.id(id);
    if (notif) {
      notif.read = true;
      await order.save();
      return res.status(200).json({ message: "Notification marked as read" });
    }

    return res.status(404).json({ message: "Notification not found" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const generateInvoice = require('../utils/generateInvoice');

// @route GET /api/orders/:orderId/invoice
// @access User only if order is delivered
const downloadInvoice = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product', 'name price')
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isDelivered = order.statusHistory.some(h => h.status.toLowerCase() === "delivered");
    if (!isDelivered)
      return res.status(403).json({ message: "Invoice is available only after delivery." });

    generateInvoice(order, order.user, res);
  } catch (error) {
    console.error("Invoice generation failed:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};


module.exports = {getAllOrders, placeOrder, getUserOrders ,  getOrderById  ,  getOrderNotifications , getMonthlySalesSummary , markNotificationAsRead , downloadInvoice};