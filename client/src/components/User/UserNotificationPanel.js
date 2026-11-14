import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import './style/NotificationPanel.css';

const UserNotificationPanel = ({ show, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (show && token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/orders/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allNotifs = res.data.notifications || [];

        // Sorting:
        // 1. Unread first, sorted by createdAt descending
        // 2. Then read, sorted by createdAt descending
        const sorted = [
          ...allNotifs
            .filter(n => !n.read)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          ...allNotifs
            .filter(n => n.read)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        ];

        setNotifications(sorted);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err);
      });
    }
  }, [show, token]);

  const handleMarkRead = (id) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/orders/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n._id === id ? { ...n, read: true } : n));
        // Re-sort again after marking read
        return [
          ...updated.filter(n => !n.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          ...updated.filter(n => n.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        ];
      });
      toast.success('Marked as read ✔️');
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="user-notification-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 18 }}
        >
          <div className="notif-header d-flex justify-content-between align-items-center">
            <h5 className="m-0 text-white">🔔 Notifications</h5>
            <button className="close-btn text-white" onClick={onClose}>
              <i className="bi bi-x-lg fs-5" />
            </button>
          </div>

          <div className="notif-body mt-3">
            {notifications.length === 0 ? (
              <motion.p
                className="text-white text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🎉 You're all caught up!
              </motion.p>
            ) : (
              notifications.map((n) => (
                <motion.div
                  key={n._id}
                  layout
                  className={`notif-card glass-light p-3 mb-3 ${n.read ? 'read' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="text-white">
                      <span className="me-2">{n.read ? '✅' : '🆕'}</span>
                      {n.message}
                      <div className="text-muted small mt-1">
                        🕒 {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 ms-2">
                      {!n.read && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-sm btn-outline-light"
                          onClick={() => handleMarkRead(n._id)}
                        >
                          Mark Read
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserNotificationPanel;
