import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/employees/login`, {
                email,
                password
            });

            localStorage.setItem('employeeToken', response.data.token); // ✅ Updated token key
            setEmail('');
            setPassword('');
            navigate('/employee/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error logging in');
        }

        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow-lg border-0 rounded-4 p-5">
                <div className="text-center mb-4">
                    <h2 className="text-dark">Employee Login</h2>
                    <p className="text-muted">Log in to manage your account and access features</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-bold text-muted">
                            <i className="bi bi-envelope-fill me-2"></i> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control form-control-lg"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-bold text-muted">
                            <i className="bi bi-lock-fill me-2"></i> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control form-control-lg"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
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

                {error && <p className="text-center text-danger mt-3">{error}</p>}

                <p className="text-center text-muted">
                    Don’t have an account?{' '}
                    <Link to="/Empsignup" className="text-decoration-none text-dark">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
