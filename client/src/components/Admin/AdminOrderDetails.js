import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const OrderDetails = () => {
  const { orderId } = useParams();
  const admintoken = localStorage.getItem("adminAccessToken");

  const [order, setOrder] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    fetchOrderDetails();
    fetchEmployees();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      setOrder(res.data);
      setNotes(res.data.notes || "NA");
    } catch (err) {
      Swal.fire("Error", "Failed to fetch order details.", "error");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/getAvailableEmployees`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Employee fetch failed:", err);
    }
  };

  const assignEmployee = async () => {
    if (!selectedEmployee) {
      Swal.fire("Warning", "Please select an employee.", "warning");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/assignOrderToEmployee`,
        { orderId, employeeId: selectedEmployee },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        Swal.fire("Success", "Order assigned successfully!", "success");
        setSelectedEmployee("");
        fetchOrderDetails();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to assign employee.", "error");
    }
  };

  const revokeEmployee = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}/revoke`,
        {},
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      Swal.fire("Success", "Assignment revoked", "success");
      fetchOrderDetails();
    } catch (err) {
      Swal.fire("Error", "Failed to revoke assignment", "error");
    }
  };

  const updateNotes = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/updateOrderNotes`,
        {
          orderId,
          notes: notes.trim() || "NA",
        },
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      Swal.fire("Success", "Notes updated successfully", "success");
      setIsEditingNotes(false);
      fetchOrderDetails();
    } catch (err) {
      Swal.fire("Error", "Could not update notes", "error");
    }
  };

  const sendNotification = async () => {
    if (!notificationMessage.trim()) {
      Swal.fire("Warning", "Please enter a notification message.", "warning");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}/notification`,
        { message: notificationMessage.trim() },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire("Success", "Notification sent!", "success");
      setNotificationMessage("");
    } catch (err) {
      Swal.fire("Error", "Failed to send notification", "error");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return "check-circle-fill";
      case "Pending": return "clock";
      case "Cancelled": return "x-circle-fill";
      case "In Progress": return "gear";
      default: return "file-earmark-text";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "Cancelled": return "danger";
      case "In Progress": return "primary";
      default: return "secondary";
    }
  };

  if (!order) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4">
        <h4 className="text-primary mb-4">
          <i className="bi bi-box-seam-fill me-2"></i>Order Details
        </h4>

        <div className="row">
          {/* Left: Order Info */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <p className="fw-bold">Order ID:</p>
                <p className="text-break">{order._id}</p>

                <p className="fw-bold mt-3">Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-3">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/product_image/${item.product.images[0]}`}
                      alt={item.product.name}
                      className="me-2 rounded"
                      style={{ width: "70px", height: "70px", objectFit: "cover" }}
                    />
                    <div>
                      <p className="mb-0 fw-semibold">{item.product.name}</p>
                      <small className="text-muted">₹{item.product.price}</small>
                    </div>
                  </div>
                ))}

                <hr />
                <p><strong>User:</strong> {order.user?.name} ({order.user?.email})</p>
                <p>
  <strong>Address:</strong>{" "}
  {order.shippingAddress
    ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
    : "NA"}
</p>

                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span className={`badge bg-${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </p>

                {/* Notification */}
                <div className="mt-4">
                  <strong>Send Notification:</strong>
                  <textarea
                    className="form-control mt-2"
                    rows={2}
                    placeholder="Type message..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                  <button className="btn btn-sm btn-primary mt-2" onClick={sendNotification}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Assignment, Notes, Timeline */}
          <div className="col-lg-6">
            {/* Employee Assignment */}
            <div className="card mb-3">
              <div className="card-body">
                <strong>Assignment:</strong>
                {order.assignedEmployee ? (
                  <>
                    <p className="mt-2">
                      Assigned to: <strong>{order.assignedEmployee.name}</strong> ({order.assignedEmployee.email})
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={revokeEmployee}>Revoke Assignment</button>
                  </>
                ) : (
                  <>
                    <select
                      className="form-select mt-2"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-sm btn-primary mt-2" onClick={assignEmployee}>Assign</button>
                  </>
                )}
              </div>
            </div>

            {/* Order Notes */}
            <div className="card mb-3">
              <div className="card-body">
                <strong>Order Notes:</strong>
                {!isEditingNotes ? (
                  <div className="d-flex justify-content-between align-items-start mt-2">
                    <p className="mb-0">{notes}</p>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditingNotes(true)}>
                      Edit
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="form-control mt-2"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm btn-success" onClick={updateNotes}>Save</button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNotes(order.notes || "NA");
                        }}
                      >Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="card-body">
                <strong>Status Timeline:</strong>
                <div className="mt-3">
                  {order.statusHistory
                    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                    .map((entry, idx) => (
                      <div key={idx} className="d-flex align-items-start mb-4">
                        <div
                          className={`me-3 bg-${getStatusColor(entry.status)} rounded-circle d-flex justify-content-center align-items-center shadow`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className={`bi bi-${getStatusIcon(entry.status)} text-white`} style={{ fontSize: "20px" }}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1">{entry.status}</h6>
                          <small className="text-muted">{new Date(entry.updatedAt).toLocaleString("en-IN")}</small>
                          {entry.note && <p className="small fst-italic text-secondary mb-0 mt-2">{entry.note}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left-circle me-2"></i>Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
