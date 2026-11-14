import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BasicOrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("adminAccessToken");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/orders`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterType === "unassigned") return !order.assignedEmployee;
    if (filterType === "assigned") return !!order.assignedEmployee;
    return true;
  });

  const handleViewDetails = (orderId) => {
    navigate(`/admin/AdminOrderDetails/${orderId}`);
  };

  const renderFormattedAddress = (address) => {
    if (!address) return "N/A";
    return (
      <div className="ms-4 mt-1 text-muted small">
        {address.fullName && <div>{address.fullName}</div>}
        {address.street && <div>{address.street}</div>}
        <div>
          {[address.city, address.state].filter(Boolean).join(", ")}
        </div>
        <div>
          {[address.pincode, address.country].filter(Boolean).join(", ")}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-3 bg-light min-vh-100">
      <div className="card shadow-lg rounded-3 p-4">
        <header className="mb-4 text-primary">
          <h2 className="fw-bold">
            <i className="bi bi-clipboard-check-fill me-2"></i> Orders Management
          </h2>
          <p className="text-muted">Manage and view order details efficiently.</p>
        </header>

        {/* Filter Orders */}
        <div className="mb-4">
          <label htmlFor="filterType" className="form-label fw-bold text-secondary">
            <i className="bi bi-funnel-fill me-2"></i> Filter Orders
          </label>
          <select
            id="filterType"
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="unassigned">Unassigned Orders</option>
            <option value="assigned">Assigned Orders</option>
          </select>
        </div>

        {/* Order List */}
        <div className="row g-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm rounded-3 h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-bold mb-3 text-primary">
                        <i className="bi bi-receipt me-2"></i> Order #{order._id}
                      </h5>
                      <ul className="list-unstyled mb-3 small">
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
                          <strong>Address:</strong>
                          {renderFormattedAddress(order.shippingAddress)}
                        </li>
                        <li>
                          <i className="bi bi-currency-rupee me-2 text-secondary"></i>
                          <strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}
                        </li>
                        <li>
                          <i className="bi bi-clock-fill me-2 text-secondary"></i>
                          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                        </li>
                        <li>
                          <i className="bi bi-box me-2 text-secondary"></i>
                          <strong>Products:</strong>
                          <ul className="ms-4 list-unstyled">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.product?.name || "N/A"} (x{item.quantity}) - ₹
                                {item.product?.price?.toFixed(2) || "N/A"}
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <i className="bi bi-info-circle-fill me-2 text-secondary"></i>
                          <strong>Status:</strong>{" "}
                          <span className="badge bg-info text-dark">
                            {order.status || "Pending"}
                          </span>
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
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Assigned Employee */}
                    <div className="mb-2">
                      {order.assignedEmployee ? (
                        <span className="badge bg-success px-3 py-2 w-100 text-center">
                          <i className="bi bi-person-check-fill me-2"></i>
                          Assigned to {order.assignedEmployee.firstName}{" "}
                          {order.assignedEmployee.lastName}
                        </span>
                      ) : (
                        <span className="badge bg-secondary px-3 py-2 w-100 text-center">
                          <i className="bi bi-person-x-fill me-2"></i> Unassigned
                        </span>
                      )}
                    </div>

                    {/* View Details */}
                    <button
                      className="btn btn-outline-primary w-100 fw-bold mt-2"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      <i className="bi bi-eye-fill me-1"></i> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No orders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicOrderDetails;
