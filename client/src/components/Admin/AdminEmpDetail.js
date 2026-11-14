import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('adminAccessToken');

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployee(res.data);
      } catch (err) {
        setError('Failed to fetch employee details.');
      }
    };

    fetchEmployee();
  }, [employeeId, token]);

  const handleApprovalToggle = async () => {
    try {
      const status = !employee.isApproved;
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/approve`,
        { employeeId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployee((prev) => ({ ...prev, isApproved: status }));
      Swal.fire('Updated!', res.data.message, 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to update approval status.', 'error');
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    if (!notification.message.trim()) {
      return Swal.fire('Warning', 'Notification message cannot be empty.', 'warning');
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/sendNotification`,
        {
          employeeId,
          message: notification.message,
          type: notification.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire('Sent!', res.data.message, 'success');
      setNotification({ message: '', type: 'info' });
    } catch (error) {
      Swal.fire('Error', 'Failed to send notification.', 'error');
    }
  };

  if (!employee) {
    return (
      <div className="container mt-5">
        {error ? <div className="alert alert-danger">{error}</div> : <div>Loading...</div>}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card p-4 shadow">
        <h3 className="text-primary mb-4">
          <i className="bi bi-person-circle me-2"></i>Employee Details
        </h3>
  
        <div className="row">
          {/* Left Section */}
          <div className="col-md-6 mb-4">
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">
                <strong>Username:</strong> {employee.username}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {employee.email}
              </li>
              <li className="list-group-item">
                <strong>Name:</strong> {employee.firstName} {employee.lastName}
              </li>
              <li className="list-group-item">
                <strong>Phone:</strong> {employee.phone}
              </li>
              <li className="list-group-item">
                <strong>Status:</strong>
                <span className={`badge ms-2 ${employee.isApproved ? 'bg-success' : 'bg-danger'}`}>
                  {employee.isApproved ? 'Approved' : 'Unauthorized'}
                </span>
              </li>
            </ul>
  
            <div className="d-flex gap-2">
              <button
                className={`btn ${employee.isApproved ? 'btn-warning' : 'btn-success'}`}
                onClick={handleApprovalToggle}
              >
                <i className={`bi ${employee.isApproved ? 'bi-x-circle' : 'bi-check-circle'} me-2`}></i>
                {employee.isApproved ? 'Mark Unauthorized' : 'Approve'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-1"></i>Back
              </button>
            </div>
          </div>
  
          {/* Right Section */}
          <div className="col-md-6">
            <h5 className="text-dark mb-3">Send Notification</h5>
            <form onSubmit={handleNotificationSubmit} className="border p-3 rounded bg-light">
              <div className="mb-3">
                <label className="form-label">Notification Type</label>
                <select
                  className="form-select"
                  value={notification.type}
                  onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter notification message"
                  value={notification.message}
                  onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-send me-2"></i>Send Notification
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default AdminEmployeeDetails;
