import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/Theam.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) {
      navigate('/UserLogin');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data);

        const orderResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(orderResponse.data.notifications);

        // Show toast for each notification
        orderResponse.data.notifications.forEach((notification) => {
          toast.info(notification.message, {
            toastId: notification._id, // prevent duplicates
          });
        });
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('userToken');
          toast.error('Session expired. Please log in again.');
          setTimeout(() => navigate('/UserLogin'), 2000);
        } else {
          setError('Error fetching user data. Please try again.');
          toast.error('Error fetching user data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast.success('Logged out successfully');
    navigate('/UserLogin');
  };

  if (loading) return <div className="text-center mt-5 text-muted">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <motion.div
      className="container py-5 section-bg"
      style={{ minHeight: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />

      <div className="text-center mb-4">
        <i className="bi bi-person-circle display-4 text-accent"></i>
        <h2 className="fw-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome, {userData?.name}
        </h2>
        <p className="text-muted fs-5">Manage your profile and orders</p>
      </div>

      <motion.div
        className="row justify-content-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-md-8">
          <div className="glass-card p-4">
            <div className="mb-4">
              <h5 className="text-dark mb-3">
                <i className="bi bi-person me-2 text-accent"></i> Profile Details
              </h5>
              <ul className="list-group list-group-flush">
  <li className="list-group-item bg-transparent border-0">
    <strong>Email:</strong> {userData?.email}
  </li>
  <li className="list-group-item bg-transparent border-0">
    <strong>Mobile Number:</strong> {userData?.mobile || 'Not provided'}
  </li>
  <li className="list-group-item bg-transparent border-0">
    <strong>Shipping Address:</strong>{' '}
    {userData?.shippingAddress ? (
      <>
        {userData.shippingAddress.street}, {userData.shippingAddress.city},<br />
        {userData.shippingAddress.state} - {userData.shippingAddress.pincode},<br />
        {userData.shippingAddress.country}
      </>
    ) : (
      'Not provided'
    )}
  </li>
  <li className="list-group-item bg-transparent border-0">
    <strong>Account Created:</strong>{' '}
    {new Date(userData?.createdAt).toLocaleDateString()}
  </li>
</ul>

            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass btn-outline-primary"
                onClick={() => navigate('/user/orders')}
              >
                <i className="bi bi-box me-2"></i> My Orders
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass btn-outline-danger"
                onClick={() => navigate('/user/wishlist')}
              >
                <i className="bi bi-heart me-2"></i> Wishlist
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass btn-outline-dark"
                onClick={() => navigate('/user/UserUpdateProfile')}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass btn-outline-secondary"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-house-door me-2"></i> Home
              </motion.button>
            </div>

            <div className="mt-4 text-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn btn-accent px-4 py-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
