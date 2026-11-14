import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmpProfileUpdate = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (err) {
        toast.error('Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('employeeToken');
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/employees/profile/update`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated!');
      navigate('/employee/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h3 className="mb-4">Update Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" className="form-control" value={formData.dob?.split('T')[0]} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary px-4">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpProfileUpdate;
