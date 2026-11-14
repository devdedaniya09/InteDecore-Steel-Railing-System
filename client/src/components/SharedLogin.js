// src/components/SharedLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SharedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        role === 'employee'
          ? `${process.env.REACT_APP_API_URL}/api/employees/login`
          : `${process.env.REACT_APP_API_URL}/api/users/login`;

      const response = await axios.post(endpoint, { email, password });

      if (role === 'employee') {
        localStorage.setItem('employeeToken', response.data.token);
        localStorage.setItem('userRole', 'employee');
        navigate('/employee/dashboard');
      } else {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userRole', 'user');
        navigate('/user/dashboard');
      }
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-5">
        <div className="text-center mb-4">
          <h2 className="text-dark">Login</h2>
          <p className="text-muted">Select your role and enter credentials</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold text-muted">Select Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-muted">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="d-grid gap-2 mb-3">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedLogin;
