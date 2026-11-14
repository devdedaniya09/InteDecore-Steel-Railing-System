import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import '../User/style/UserSidebar.css';
import UserNotificationPanel from './UserNotificationPanel';
import axios from 'axios';

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString('en-GB');
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  return (
    <div className="date-time-display text-start">
      <div className="mb-2">
        <span className="text-white fw-bold fs-5">
          <i className="bi bi-calendar me-2"></i>{formattedDate}
        </span>
      </div>
      <div>
        <span className="text-white fw-bold fs-5">
          <i className="bi bi-clock me-2"></i>{formattedTime}
        </span>
      </div>
    </div>
  );
};

function UserSidebar({ isLoggedIn, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        onLogout();
        navigate('/');
      }
    });
  };

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 992) setIsSidebarOpen(true);
    else setIsSidebarOpen(false);
  }, [windowWidth]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/orders/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const unread = res.data.notifications?.some((n) => !n.read);
        setHasUnread(unread);
      }).catch((err) => {
        console.error('Failed to fetch notifications:', err);
      });
    }
  }, [showNotificationPanel]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const getActiveClass = (path) => location.pathname === path ? 'active' : '';

  const handleLinkClick = (path) => {
    if (windowWidth < 992) setIsSidebarOpen(false);
    navigate(path);
  };

  return (
    <>
      {windowWidth < 992 && (
        <button className={`sidebar-toggle-btn ${isSidebarOpen ? 'd-none' : ''}`} onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      )}

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="sidebar sidebar-open"
          >
            {windowWidth < 992 && (
              <button className="sidebar-close-btn" onClick={toggleSidebar}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}

            <div className="h-100">
              <div className="card-body">
                <div className="d-flex p-1 ps-2 bg-secondary rounded flex-column mb-3">
                  <DateTimeDisplay />
                </div>

                <hr className="text-white" />

                <div className="d-flex flex-column mb-3">

                  
                  <Link to="/user/productlist" className={`btn mb-2 d-flex align-items-center ${getActiveClass('/user/productlist')}`} onClick={() => handleLinkClick('/user/productlist')}>
                    <i className="fas fa-store me-2"></i> Shop
                  </Link>
                  <Link to="/user/UserOders" className={`btn mb-2 d-flex align-items-center ${getActiveClass('/user/UserOders')}`} onClick={() => handleLinkClick('/user/UserOders')}>
                    <i className="fas fa-box me-2"></i> My Orders
                  </Link>
                  <Link to="/user/UserCart" className={`btn mb-2 d-flex align-items-center ${getActiveClass('/user/UserCart')}`} onClick={() => handleLinkClick('/user/UserCart')}>
                    <i className="fas fa-shopping-cart me-2"></i> Shopping Cart
                  </Link>
                  <Link to="/user/dashboard" className={`btn mb-2 d-flex align-items-center ${getActiveClass('/user/dashboard')}`} onClick={() => handleLinkClick('/user/dashboard')}>
                    <i className="fas fa-user-circle me-2"></i> Profile
                  </Link>
                  <Link to="/user/UserWishList" className={`btn mb-2 d-flex align-items-center ${getActiveClass('/user/UserWishList')}`} onClick={() => handleLinkClick('/user/UserWishList')}>
                    <i className="fas fa-heart me-2"></i> Wishlist
                  </Link>
                  

                  {/* 🔔 Notifications */}
                  <button
                    className="btn text-start text-white position-relative"
                    onClick={() => setShowNotificationPanel(true)}
                  >
                    <i className="fas fa-bell me-2"></i> Notifications
                    {hasUnread && <span className="notif-badge-dot"></span>}
                  </button>

                  {/* 🔓 Logout */}
                  {isLoggedIn && (
                    <div className="mt-3">
                      <button className="btn btn-danger d-sm-inline d-block" onClick={handleLogout}>
                        <i className="fa fa-sign-out me-2" aria-hidden="true"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📨 Notification Panel */}
      <UserNotificationPanel
        show={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        isMobile={windowWidth < 992}
      />
    </>
  );
}

export default UserSidebar;
