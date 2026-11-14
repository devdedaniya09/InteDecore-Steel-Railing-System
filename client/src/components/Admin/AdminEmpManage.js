import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminEmpManage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminAccessToken');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/employees/employees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (err) {
        setError('Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  useEffect(() => {
    let filtered = [...employees];

    // Filter by name
    if (searchTerm) {
      filtered = filtered.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter === 'approved') {
      filtered = filtered.filter((emp) => emp.isApproved);
    } else if (statusFilter === 'unauthorized') {
      filtered = filtered.filter((emp) => !emp.isApproved);
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, statusFilter, employees]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-3 min-vh-100">
      <div className="card shadow-lg p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h2 className="fw-bold text-primary m-0">
            <i className="bi bi-people-fill me-2"></i>Employee Management
          </h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {/* Search and Filter Inputs */}
        <div className="d-flex flex-column flex-md-row gap-2 w-100 w-sm-auto mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Employees</option>
            <option value="approved">Approved</option>
            <option value="unauthorized">Unauthorized</option>
          </select>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="alert alert-warning">No employees found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.username}</td>
                      <td>{employee.email}</td>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${employee.isApproved ? 'bg-success' : 'bg-danger'}`}
                        >
                          {employee.isApproved ? 'Approved' : 'Unauthorized'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/employees/${employee._id}`}>
                          <button className="btn btn-sm btn-info text-white">
                            <i className="bi bi-eye-fill me-1"></i>View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="d-block d-md-none">
              {filteredEmployees.map((employee) => (
                <div key={employee._id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{employee.firstName} {employee.lastName}</h5>
                    <p className="mb-1"><strong>Username:</strong> {employee.username}</p>
                    <p className="mb-1"><strong>Email:</strong> {employee.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {employee.phone}</p>
                    <p className="mb-2">
                      <span className={`badge ${employee.isApproved ? 'bg-success' : 'bg-danger'}`}>
                        {employee.isApproved ? 'Approved' : 'Unauthorized'}
                      </span>
                    </p>
                    <Link to={`/admin/employees/${employee._id}`}>
                      <button className="btn btn-sm btn-info text-white w-100">
                        <i className="bi bi-eye-fill me-1"></i>View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminEmpManage;
