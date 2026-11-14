import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setEmployee(data);
        setLoading(false);

        const unread = data.notifications?.filter(n => !n.read) || [];
        unread.forEach(notification => {
          const toastOptions = {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeButton: true,
            theme: 'colored',
          };

          switch (notification.type) {
            case 'warning':
              toast.warn(notification.message, toastOptions);
              break;
            case 'info':
              toast.info(notification.message, toastOptions);
              break;
            default:
              toast(notification.message, toastOptions);
          }
        });

      } catch (err) {
        console.error(err);
        setError('Failed to fetch employee details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  const { username, firstName, lastName, email, phone, dob, address, isApproved } = employee;
  const dateOfBirth = new Date(dob).toLocaleDateString();

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow-lg rounded-4 p-4 border-0 bg-light">
        <h2 className="text-center text-dark mb-4">👨‍💼 Employee Dashboard</h2>

        <div className="row">
          <div className="col-md-6 mb-3">
            <h5 className="text-secondary">Basic Information</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Username:</strong> {username}</li>
              <li className="list-group-item"><strong>Full Name:</strong> {firstName} {lastName}</li>
              <li className="list-group-item"><strong>Email:</strong> {email}</li>
              <li className="list-group-item"><strong>Phone:</strong> {phone}</li>
            </ul>
          </div>

          <div className="col-md-6 mb-3">
            <h5 className="text-secondary">Other Details</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Date of Birth:</strong> {dateOfBirth}</li>
              <li className="list-group-item"><strong>Address:</strong> {address}</li>
              <li className="list-group-item">
                <strong>Status:</strong>
                <span className={`badge ms-2 ${isApproved ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
