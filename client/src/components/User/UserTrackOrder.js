import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import './style/Theam.css';

const coral = "#FF6F61";

const UserTrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");
  const formatAddress = (address) => {
    if (!address || typeof address !== "object") return "No address available";
    const { street, city, state, pincode, country } = address;
    return [street, city, state, pincode, country].filter(Boolean).join(", ");
  };

  useEffect(() => {
    const fetchOrderAndUserDetails = async () => {
      try {
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/dashboard`, config);
        setUser(userRes.data);

        const orderRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/userorders`, config);
        const foundOrder = orderRes.data.find((o) => o._id === orderId);

        if (!foundOrder) {
          setError("Order not found.");
        } else {
          setOrder(foundOrder);
        }
      } catch {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndUserDetails();
  }, [orderId]);

  if (loading)
    return <div className="text-center mt-5 text-muted">Loading your order details...</div>;

  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <section className="section-bg py-5" style={{ minHeight: "100vh" }}>
      <div className="container">

        {/* ✅ Go Back Button */}
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-outline-secondary rounded-pill"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2" />
            Go Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 text-center"
        >
          <h1 className="display-5 fw-bold" style={{ color: coral }}>
            <i className="bi bi-truck me-2" /> Order Tracking
          </h1>
          <p className="text-muted fs-5">Track your order’s journey with elegance</p>
        </motion.div>

        <div className="row g-4">
          {/* Order Details */}
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-4 rounded-4"
            >
              <h5 className="fw-bold text-dark mb-4">Ordered Items</h5>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3"
                >
                  <div>
                    <h6 className="fw-semibold">{item.product?.name || "Product"}</h6>
                    <p className="text-muted small mb-1">
                      {item.product?.size || "Size"} / {item.product?.color || "Color"}
                    </p>
                    <p className="text-primary fw-bold">
                      ₹{item.product?.price || 0} × {item.quantity}
                    </p>
                  </div>
                  <img
                    src={
                      item.product?.images?.[0]
                        ? `${process.env.REACT_APP_API_URL}/product_image/${item.product.images[0]}`
                        : "https://via.placeholder.com/90"
                    }
                    alt="Product"
                    className="rounded-3"
                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                  />
                </div>
              ))}

              <h6 className="text-success mt-4 fw-bold">Order Status</h6>
              {order.statusHistory?.some(h => h.status.toLowerCase() === "delivered") && (
                <a
                  href={`${process.env.REACT_APP_API_URL}/api/orders/invoice/${order._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success rounded-pill mt-3"
                >
                  <i className="bi bi-download me-2"></i>
                  Download Invoice (PDF)
                </a>
              )}

              <ul className="list-group list-group-flush mt-3">
                {order.statusHistory?.length ? (
                  order.statusHistory
                    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                    .map((history, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex align-items-start position-relative ps-5"
                      >
                        <div
                          className={`position-absolute top-50 start-0 translate-middle rounded-circle p-2 ${getDotColor(history.status)}`}
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <div>
                          <h6 className="mb-1 fw-bold">{history.status}</h6>
                          <p className="text-muted small mb-0">
                            {new Date(history.updatedAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {history.note && (
                            <p className="text-muted small mt-1">{history.note}</p>
                          )}
                        </div>
                      </li>
                    ))
                ) : (
                  <p className="text-muted">No status updates yet.</p>
                )}
              </ul>
            </motion.div>
          </div>

          {/* Shipping & Pricing Details */}
          <div className="col-lg-4">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-4 rounded-4"
            >
              <h6 className="fw-bold text-muted mb-3">Shipping Details</h6>
              <div className="bg-light p-3 rounded-3 mb-3">
                <p className="mb-1 fw-bold">{user?.name || "Customer Name"}</p>
                <p className="text-muted mb-1">{user?.email}</p>
                <p className="text-muted mb-0">{formatAddress(order.shippingAddress)}</p>

              </div>

              <hr />

              <h6 className="fw-bold text-muted mb-3">Price Summary</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  Total Items:
                  <span className="badge bg-accent rounded-pill">{order.items.length}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Total Price:
                  <span className="fw-bold text-accent">₹{order.totalPrice}</span>
                </li>
              </ul>

              <button className="btn btn-outline-dark mt-4 w-100 rounded-pill">
                <i className="bi bi-headset me-2" />
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ Helper function for timeline dot color
function getDotColor(status) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-success";
    case "shipped":
      return "bg-primary";
    case "processing":
      return "bg-warning";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

export default UserTrackOrder;
