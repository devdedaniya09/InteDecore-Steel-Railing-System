import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{10}$/.test(mobile)) {
      Swal.fire({
        title: 'Error!',
        text: 'Mobile number must be exactly 10 digits!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      mobile,
      password,
      shippingAddress,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        userData
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          navigate('/UserLogin');
        });

        // Reset form
        setName('');
        setEmail('');
        setMobile('');
        setPassword('');
        setShippingAddress({ street: '', city: '', state: '', pincode: '' });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Error registering user',
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
          <h2 className="text-dark">User Registration</h2>
          <p className="text-muted">Register to join our platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="form-label fw-bold text-muted">
              <i className="bi bi-person-fill me-2"></i> Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Mobile */}
          <div className="mb-4">
            <label htmlFor="mobile" className="form-label fw-bold text-muted">
              <i className="bi bi-phone-fill me-2"></i> Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              className="form-control form-control-lg"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              maxLength="10"
            />
          </div>

          {/* Password */}
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

          {/* Shipping Address (Structured Fields) */}
          <div className="mb-3">
            <label className="form-label fw-bold text-muted">
              <i className="bi bi-house-door-fill me-2"></i> Shipping Address
            </label>
            <input
              type="text"
              name="street"
              className="form-control form-control-lg mb-2"
              placeholder="Street Address"
              value={shippingAddress.street}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              className="form-control form-control-lg mb-2"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              className="form-control form-control-lg mb-2"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pincode"
              className="form-control form-control-lg"
              placeholder="Pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
              required
              maxLength="6"
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
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
          <button
            className="btn btn-link"
            onClick={() => navigate('/UserLogin')}
          >
            Already have an account? Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
