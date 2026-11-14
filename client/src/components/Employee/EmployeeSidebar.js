import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationPanel from './EmployeeNotificationHandler';
import './Style/EmployeeSidebar.css';

const EmployeeSidebar = ({ isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getActiveClass = (path) => {
    return location.pathname === path ? 'btn-primary' : 'btn-outline-primary';
  };

  const handleLinkClick = () => {
    if (windowWidth < 992) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {windowWidth < 992 && (
        <button
          className={`sidebar-toggle-btn ${isSidebarOpen ? 'd-none' : ''}`}
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${windowWidth < 992 && !isSidebarOpen ? 'sidebar-closed' : 'sidebar-open'}`}>
        {/* Close Button */}
        {windowWidth < 992 && isSidebarOpen && (
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        <div className="h-100 d-flex flex-column justify-content-between">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex flex-column p-2 mb-3 sidebar-header rounded shadow-sm">
              <h5 className="text-white m-0">Employee Panel</h5>
            </div>

            <hr className="text-white" />

            {/* Navigation */}
            <div className="d-flex flex-column gap-2">
              <Link
                to="/employee/dashboard"
                className={`btn d-flex align-items-center ${getActiveClass('/employee/dashboard')}`}
                onClick={handleLinkClick}
              >
                <i className="bi bi-house-door me-2"></i> Dashboard
              </Link>

              <button
                className="btn d-flex align-items-center btn-outline-primary"
                onClick={() => setShowNotificationPanel(true)}
              >
                <i className="bi bi-bell me-2"></i> Notifications
              </button>

              <Link
                to="/employee/orders"
                className={`btn d-flex align-items-center ${getActiveClass('/employee/orders')}`}
                onClick={handleLinkClick}
              >
                <i className="bi bi-clipboard-data me-2"></i> Assigned Orders
              </Link>

              <Link
                to="/employee/EmpProfileUpdate"
                className={`btn d-flex align-items-center ${getActiveClass('/employee/EmpProfileUpdate')}`}
                onClick={handleLinkClick}
              >
                <i className="bi bi-person me-2"></i> ProfileUpdate
              </Link>
            </div>
          </div>

          {/* Footer - Logout */}
          <div className="mb-4 px-2">
            {isLoggedIn && (
              <button
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotificationPanel && (
        <NotificationPanel onClose={() => setShowNotificationPanel(false)} />
      )}
    </>
  );
};

export default EmployeeSidebar;
