import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const res = await axios.get('http://localhost:5000/api/employees/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching orders.');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container py-3">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-3">
        <div className="text-center text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-3 bg-light min-vh-100">
      <div className="card shadow-lg rounded-3 p-4">
        <header className="mb-4 text-primary">
          <h2 className="fw-bold">
            <i className="bi bi-briefcase-fill me-2"></i> Assigned Orders
          </h2>
          <p className="text-muted">View and update your assigned orders.</p>
        </header>

        <div className="row g-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm rounded-3 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-receipt me-2 text-primary"></i> Order #{order._id}
                    </h5>
                    <ul className="list-unstyled mb-3">
                      <li>
                        <i className="bi bi-person-fill me-2 text-secondary"></i>
                        <strong>Name:</strong> {order.user?.name || "N/A"}
                      </li>
                      <li>
                        <i className="bi bi-envelope-fill me-2 text-secondary"></i>
                        <strong>Email:</strong> {order.user?.email || "N/A"}
                      </li>
                      <li>
  <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>
  <strong>Address:</strong>{" "}
  {order.shippingAddress
    ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
    : "N/A"}
</li>

                      <li>
                        <i className="bi bi-currency-rupee me-2 text-secondary"></i>
                        <strong>Total:</strong> ₹{(order.totalPrice || order.totalAmount)?.toFixed(2)}
                      </li>
                      <li>
                        <i className="bi bi-clock-fill me-2 text-secondary"></i>
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                      </li>
                      <li>
                        <i className="bi bi-info-circle-fill me-2 text-secondary"></i>
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-info text-dark">{order.status || "Pending"}</span>
                      </li>
                      <li>
                        <i className="bi bi-credit-card-2-front-fill me-2 text-secondary"></i>
                        <strong>Payment Status:</strong>{" "}
                        <span
                          className={`badge ${
                            order.paymentStatus === "Paid"
                              ? "bg-success"
                              : order.paymentStatus === "Failed"
                              ? "bg-danger"
                              : order.paymentStatus === "Refunded"
                              ? "bg-warning"
                              : "bg-secondary"
                          }`}
                        >
                          {order.paymentStatus || "N/A"}
                        </span>
                      </li>
                    </ul>

                    <Link
                      to={`/employee/orders/${order._id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      <i className="bi bi-pencil-square me-2"></i> Update Order
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No assigned orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeOrdersList;
