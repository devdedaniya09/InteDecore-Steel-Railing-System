import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const admintoken = localStorage.getItem('adminAccessToken'); // Fetch JWT token

      if (!admintoken) {
        Swal.fire({
          title: 'Unauthorized',
          text: 'Your session has expired. Please log in again.',
          icon: 'warning',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${admintoken}`, // Attach token in request headers
          }
        });

        setAdminData(response.data.admin);
      } catch (error) {
        if (error.response?.status === 403) {
          Swal.fire({
            title: 'Access Denied!',
            text: 'You are not authorized to view this page.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/login');
          });
        } else {
          setError('Failed to fetch dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-4"><i className="bi bi-arrow-clockwise me-2"></i> Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  const createdAt = new Date(adminData?.dateCreated).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mt-3">
      <div className="card shadow-lg p-4" style={{ borderRadius: '12px', border: '1px solid #e1e1e1' }}>
        <h2 className="text-center text-primary mb-3">Welcome to Admin Dashboard</h2>
        <p className="text-center text-secondary mb-4">
          Hello, <strong>{adminData?.username}</strong>!
        </p>
        
        <div className="d-flex justify-content-between mb-3">
          <p className="text-muted"><strong>Email:</strong> {adminData?.email}</p>
          <p className="text-muted"><strong>Account Created:</strong> {createdAt}</p>
        </div>
        
        {/* Button and other information could go here */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary" onClick={() => navigate('/admin/settings')}>
            <i className="bi bi-gear-fill me-2"></i> Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
