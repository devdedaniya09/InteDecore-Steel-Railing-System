import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../Admin/Style/Sidebar.css";

function Sidebar({ isLoggedIn, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track if sidebar is open or closed
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width
  const navigate = useNavigate();
  const location = useLocation();

  // Handle resizing of the window
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar open/close on mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when link is clicked (on mobile view)
  const handleLinkClick = (path) => {
    if (windowWidth < 992) {
      setIsSidebarOpen(false);
    }
    navigate(path);
  };

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Hamburger icon (Sidebar open button) for mobile */}
      {windowWidth < 992 && (
        <button
          className={`sidebar-toggle-btn ${isSidebarOpen ? 'd-none' : ''}`}
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i> {/* Bootstrap icon for menu */}
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${windowWidth < 992 && !isSidebarOpen ? 'sidebar-closed' : 'sidebar-open'}`}>
        {/* Close button (X icon) when sidebar is open */}
        {windowWidth < 992 && isSidebarOpen && (
          <button
            className="sidebar-close-btn"
            onClick={toggleSidebar}
          >
            <i className="bi bi-x-lg"></i> {/* Bootstrap icon for close */}
          </button>
        )}

        <div className="h-100">
          <div className="card-body">
            <div className="d-flex p-1 ps-2 bg-secondary rounded flex-column mb-3">
              <h5 className="text-white">Admin Panel</h5>
            </div>
            <hr className="text-white" />
            <div className="d-flex flex-column mb-3">
              {/* Sidebar Links with Bootstrap Icons */}
              <Link
                to="/admin/dashboard"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/dashboard')}`}
                onClick={() => handleLinkClick('/admin/dashboard')}
              >
                <i className="bi bi-house-door me-2"></i> Dashboard
              </Link>
              <Link
                to="/admin/productlist"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/productlist')}`}
                onClick={() => handleLinkClick('/admin/productslist')}
              >
                <i className="bi bi-box me-2"></i> Products
              </Link>
              <Link
                to="/admin/AdminBasicOrderDetails"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/AdminBasicOrderDetails')}`}
                onClick={() => handleLinkClick('/admin/AdminBasicOrderDetails')}
              >
                <i className="bi bi-clipboard me-2"></i> Orders
              </Link>
              <Link
                to="/admin/AdminEmpManage"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/AdminEmpManage')}`}
                onClick={() => handleLinkClick('/admin/AdminEmpManage')}
              >
                <i className="bi bi-person-lines-fill me-2"></i> Employee
              </Link>
              
              <Link
                to="/admin/AdminSalesChart"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/AdminSalesChart')}`}
                onClick={() => handleLinkClick('/admin/AdminSalesChart')}
              >
                <i className="bi bi-bar-chart me-2"></i> Admin Sales Chart 
              </Link>
              <Link
                to="/admin/AdminMarketing"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/AdminMarketing')}`}
                onClick={() => handleLinkClick('/admin/AdminMarketing')}
              >
                <i className="bi bi-megaphone me-2"></i> Marketing
              </Link>
              
              <Link
                to="/admin/control-panel"
                className={`btn mb-2 d-flex align-items-center ${getActiveClass('/admin/control-panel')}`}
                onClick={() => handleLinkClick('/admin/control-panel')}
              >
                <i className="bi bi-shield-lock me-2"></i> Admin Control
              </Link>

              {/* Logout Button */}
              {isLoggedIn && (
                <div className="mb-4">
                  <button
                    className="btn btn-danger d-sm-inline d-block"
                    onClick={onLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
