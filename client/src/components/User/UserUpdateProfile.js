import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/Theam.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserUpdateProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          mobile: response.data.mobile,
          shippingAddress: {
            ...prev.shippingAddress,
            ...response.data.shippingAddress,
          },
        }));
      } catch (err) {
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('shippingAddress.')) {
      const key = name.split('.')[1];
      setUser((prevUser) => ({
        ...prevUser,
        shippingAddress: {
          ...prevUser.shippingAddress,
          [key]: value,
        },
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update-profile`,
        {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          shippingAddress: user.shippingAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Profile updated successfully.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-bg py-5" style={{ minHeight: '100vh' }}>
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-card p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-lines-fill display-4" style={{ color: 'var(--highlight-color)' }}></i>
                <h2 className="lux-heading">Update Your Profile</h2>
                <p className="lux-subheading">Keep your details up to date</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control input-glass"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control input-glass"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control input-glass"
                    id="mobile"
                    name="mobile"
                    value={user.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Enter your mobile number"
                  />
                </div>

                <h5 className="mb-3 mt-4">Shipping Address</h5>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-glass"
                    name="shippingAddress.street"
                    value={user.shippingAddress.street}
                    onChange={handleChange}
                    placeholder="Street"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-glass"
                    name="shippingAddress.city"
                    value={user.shippingAddress.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-glass"
                    name="shippingAddress.state"
                    value={user.shippingAddress.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-glass"
                    name="shippingAddress.pincode"
                    value={user.shippingAddress.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control input-glass"
                    name="shippingAddress.country"
                    value={user.shippingAddress.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-accent px-5 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserUpdateProfile;
