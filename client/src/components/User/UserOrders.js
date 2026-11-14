import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './style/Theam.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!token) {
        setError('Unauthorized: Please log in.');
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/userorders`, config);
      const fetchedOrders = Array.isArray(response.data) ? response.data : [];

      // Sort orders by createdAt descending
      fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  return (
    <section className="section-bg py-5" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-accent" style={{ fontFamily: 'Poppins, sans-serif' }}>
            📦 Your Premium Orders
          </h2>
          <p className="text-muted fs-5">Track your refined stainless steel selections</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-accent" role="status"></div>
            <p className="mt-3">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-warning text-center">You haven’t placed any orders yet.</div>
        ) : (
          <motion.div layout className="row g-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="col-md-6 col-lg-4"
              >
                <div
                  className="glass-card p-4 h-100 d-flex flex-column justify-content-between"
                  onClick={() => navigate(`/user/UserTrackOrder/${order._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <h5 className="text-dark fw-bold mb-3">
                      <i className="bi bi-receipt me-2"></i>Order ID:
                      <span className="ms-1 text-muted">{order._id.slice(-6).toUpperCase()}</span>
                    </h5>

                    <div className="mb-3">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item._id} className="d-flex mb-2 align-items-center">
                          <img
                            src={
                              item.product?.images?.[0]
                                ? `${process.env.REACT_APP_API_URL}/product_image/${item.product.images[0]}`
                                : 'https://via.placeholder.com/100'
                            }
                            alt={item.product?.name || 'Product'}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              marginRight: '15px',
                            }}
                          />
                          <div>
                            <p className="mb-0 fw-semibold text-dark">
                              {item.product?.name || 'Product'}
                            </p>
                            <small className="text-muted">
                              ₹{item.product?.price || 'N/A'} × {item.quantity}
                            </small>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <small className="text-muted">+{order.items.length - 2} more items</small>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold fs-5 text-accent">₹{order.totalPrice}</span>
                    <span
                      className={`badge rounded-pill px-3 py-2 fw-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-success'
                          : order.status === 'Cancelled'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UserOrders;
