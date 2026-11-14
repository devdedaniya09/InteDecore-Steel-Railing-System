// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");
  const name = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top py-1">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          Inte<span style={{ color: "#FF6F61" }}>Decor</span>
        </Link>

        {/* Toggler */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Left links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/PublicProductList">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AboutUs">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ContactUs">Contact</Link>
            </li>
          </ul>

          {/* Search */}
          <form className="d-flex me-3">
            <input className="form-control me-2" type="search" placeholder="Search..." />
            <button className="btn btn-outline-light">🔍</button>
          </form>

          {/* Right side */}
          <ul className="navbar-nav">
            {/* If user logged in */}
            {token ? (
              <>
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                    👋 {name || role}
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {role === "user" && (
                      <li><Link className="dropdown-item" to="/user/dashboard">User Dashboard</Link></li>
                    )}
                    {role === "employee" && (
                      <li><Link className="dropdown-item" to="/employee/dashboard">Employee Dashboard</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>🚪 Logout</button></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/UserCart">🛒</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                    Login
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/Userlogin">User Login</Link></li>
                    
                    <li><Link className="dropdown-item" to="/Emplogin">Employee Login</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
