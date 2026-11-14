import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = { email, password };

    try {
      // Login request with credentials
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        loginData,
        { withCredentials: true } // Ensuring secure cookies are sent
      );

      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Login successful! Redirecting...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        // Store tokens securely
        localStorage.setItem('adminAccessToken', response.data.accessToken);

        // Redirect to the admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Invalid email or password',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-5">
        <div className="text-center mb-4">
          <h2 className="text-dark">Admin Login</h2>
          <p className="text-muted">Log in to manage your Intedecore Steel Railing Systems</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold text-muted">
              <i className="bi bi-envelope-fill me-2"></i> Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold text-muted">
              <i className="bi bi-lock-fill me-2"></i> Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split me-2"></i> Logging in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-muted">
          Don’t have an account?{' '}
          <Link to="/Adminregister" className="text-decoration-none text-dark">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
