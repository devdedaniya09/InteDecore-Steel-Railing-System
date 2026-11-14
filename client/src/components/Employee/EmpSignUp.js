import React, { useState } from 'react';
import axios from 'axios';

const EmpSignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/employees/signup`, {
                username, 
                email, 
                password, 
                firstName, 
                lastName, 
                phone, 
                dob, 
                address
            });
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred during sign-up');
            setSuccess('');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow-lg border-0 rounded-4 p-5">
                <div className="text-center mb-4">
                    <h2 className="text-dark">Employee Sign-Up</h2>
                    <p className="text-muted">Create your account to join the team</p>
                </div>

                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="username" className="form-label fw-bold text-muted">
                            <i className="bi bi-person-fill me-2"></i> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="form-control form-control-lg"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="firstName" className="form-label fw-bold text-muted">
                            <i className="bi bi-person-fill me-2"></i> First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control form-control-lg"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="form-label fw-bold text-muted">
                            <i className="bi bi-person-fill me-2"></i> Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control form-control-lg"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label fw-bold text-muted">
                            <i className="bi bi-lock-fill me-2"></i> Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control form-control-lg"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="form-label fw-bold text-muted">
                            <i className="bi bi-phone-fill me-2"></i> Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className="form-control form-control-lg"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dob" className="form-label fw-bold text-muted">
                            <i className="bi bi-calendar-fill me-2"></i> Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            className="form-control form-control-lg"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="form-label fw-bold text-muted">
                            <i className="bi bi-house-door-fill me-2"></i> Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="form-control form-control-lg"
                            placeholder="Enter your address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid gap-2 mb-4">
                        <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-person-plus-fill me-2"></i> Sign Up
                        </button>
                    </div>
                </form>

                {success && <p className="text-center text-success mt-3">{success}</p>}
                {error && <p className="text-center text-danger mt-3">{error}</p>}

                <p className="text-center text-muted">
                    Already have an account?{' '}
                    <a href="/Emplogin" className="text-decoration-none text-dark">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default EmpSignUp;
