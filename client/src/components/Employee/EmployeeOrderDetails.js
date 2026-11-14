import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EmployeeOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusOptions = ["Pending", "Processing", "Completed", "Delivered", "Cancelled"];
  const paymentOptions = ["Unpaid", "Paid", "Refunded", "Failed"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("employeeToken");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        Swal.fire("Error", "Failed to load order details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const confirmAndUpdate = async (type, value, apiEndpoint, updateFn, label) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to change ${label} to "${value}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("employeeToken");
        await axios.put(
          `${process.env.REACT_APP_API_URL}${apiEndpoint}`,
          { orderId, [type]: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateFn(prev => ({ ...prev, [type]: value }));
        Swal.fire("Updated", `${label} updated successfully!`, "success");
      } catch (err) {
        console.error(`Error updating ${label.toLowerCase()}:`, err);
        Swal.fire("Error", `Failed to update ${label.toLowerCase()}.`, "error");
      }
    }
  };

  if (loading) return <p className="text-center my-5">Loading order details...</p>;
  if (!order) return <p className="text-danger text-center">Order not found.</p>;

  return (
    <div className="container py-4" style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <div className="card shadow-lg rounded-3 p-4" style={{ backgroundColor: "#FFFFFF" }}>
        <header className="mb-4 text-primary">
          <h2 className="fw-bold">
            <i className="bi bi-tools me-2"></i> Manage Order
          </h2>
          <p className="text-muted">Update and track order status efficiently.</p>
        </header>

        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-4">
            <h5 className="text-primary">
              <i className="bi bi-hash me-2"></i>Order ID: {order._id}
            </h5>

            <div className="mb-3">
              <h5 className="text-primary">Order Items:</h5>
              {order.items?.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/product_image/${item?.product?.images?.[0] || "default.jpg"}`}
                    alt={item?.product?.name || "Product"}
                    style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                  />
                  <div>
                    <p className="mb-1 text-muted">Product: {item?.product?.name}</p>
                    <p className="mb-1 text-muted">Price: ₹{item?.product?.price}</p>
                    <p className="mb-1 text-muted">Qty: {item?.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="fw-semibold">
              <i className="bi bi-person-fill me-2 text-secondary"></i>Name:
              <span className="text-muted ms-2">{order?.user?.name}</span>
            </p>
            <p className="fw-semibold">
              <i className="bi bi-envelope-fill me-2 text-secondary"></i>Email:
              <span className="text-muted ms-2">{order?.user?.email}</span>
            </p>
            <p className="fw-semibold">
  <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>Address:
  <span className="text-muted ms-2">
    {order?.shippingAddress
      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
      : "N/A"}
  </span>
</p>

            <p className="fw-semibold">
              <i className="bi bi-currency-rupee me-2 text-secondary"></i>Total:
              <span className="text-muted ms-2">₹{order?.totalPrice}</span>
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              <span className={`badge ${
                order.paymentStatus === "Paid" ? "bg-success" :
                order.paymentStatus === "Failed" ? "bg-danger" :
                order.paymentStatus === "Refunded" ? "bg-warning" : "bg-secondary"
              }`}>
                {order.paymentStatus}
              </span>
            </p>

            {/* Displaying Notes */}
            <div className="mt-4">
              <strong>Order Notes:</strong>
              <p>{order.notes === 'N/A' ? 'No notes available' : order.notes}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6 mb-4">
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary">Update Order Status</label>
              <select
                className="form-select"
                value={order.status}
                onChange={(e) => confirmAndUpdate("status", e.target.value, "/api/employees/orders/status", setOrder, "Order Status")}
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-secondary">Update Payment Status</label>
              <select
                className="form-select"
                value={order.paymentStatus || "Unpaid"}
                onChange={(e) => confirmAndUpdate("paymentStatus", e.target.value, "/api/employees/orders/payment-status", setOrder, "Payment Status")}
              >
                {paymentOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Status History */}
            <div>
              <strong>Status History:</strong>
              <div className="timeline mt-3 position-relative ps-3 border-start border-3 border-success">
                {order.statusHistory?.sort(
                  (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
                ).map((history, index) => (
                  <div key={index} className="timeline-item mb-4 position-relative">
                    <div
                      className="timeline-dot bg-success position-absolute start-0 translate-middle rounded-circle"
                      style={{
                        width: "14px",
                        height: "14px",
                        top: "5px",
                        left: "-7px",
                      }}
                    ></div>
                    <div className="ms-4">
                      <h6 className="mb-1 fw-bold">{history.status}</h6>
                      <p className="mb-0 text-muted">
                        {new Date(history.updatedAt).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {history.note && (
                        <p className="small fst-italic text-secondary mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
            style={{ padding: "10px 20px", borderRadius: "5px", fontWeight: "600" }}
          >
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOrderDetails;
