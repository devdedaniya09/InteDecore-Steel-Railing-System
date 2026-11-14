import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UserLogin = () => {
  // State for form inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Prepare data to send to backend
    const loginData = {
      email,
      password
    };

    try {
      // Send POST request to backend for login
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, loginData);

      // Handle success response
      setMessage('Login successful!');
      localStorage.setItem('userToken', response.data.token);
      setEmail('');
      setPassword('');

      // Redirect to the user dashboard or landing page
      navigate('/user/productlist'); // Make sure this is the correct route for your dashboard

    } catch (error) {
      // Handle error response
      setMessage(error.response?.data?.message || 'Error logging in');
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-5">
        <div className="text-center mb-4">
          <h2 className="text-dark">User Login</h2>
          <p className="text-muted">Log in to access your account</p>
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

        {message && <p className="text-center text-danger mt-3">{message}</p>}

        <p className="text-center text-muted">
          Don’t have an account?{' '}
          <Link to="/UserRegister" className="text-decoration-none text-dark">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
