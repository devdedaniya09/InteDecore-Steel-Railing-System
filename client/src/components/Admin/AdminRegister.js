import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Stronger Password Regex (8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordStrengthRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!passwordStrengthRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      setLoading(false);
      return;
    }

    const adminData = { username, email, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/register`,
        adminData,
        { withCredentials: true } // Ensures secure cookies are used
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          navigate('/login');
        });

        // Clear input fields
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Error registering admin',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-4">
      <div className="card shadow-lg border-0 rounded-4 p-5 max-w-md mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-dark">Admin Registration</h2>
          <p className="text-muted">
            Register to manage your Intedecore Steel Railing Systems
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label fw-bold text-muted">
              <i className="bi bi-person-fill me-2"></i> Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control form-control-lg"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold text-muted">
              <i className="bi bi-envelope-fill me-2"></i> Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control form-control-lg"
              placeholder="Enter email"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>

          <div className="d-grid gap-2 mb-">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split me-2"></i> Registering...
                </>
              ) : (
                <>
                  <i className="bi bi-person-check-fill me-2"></i> Register
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-danger">
          <button className="btn btn-link" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
