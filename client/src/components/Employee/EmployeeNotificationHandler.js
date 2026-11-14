import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Employee/Style/NotificationPanel.css'; // Adjust the path

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('employeeToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('employeeToken');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/employees/notifications/read`, { notificationId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );

      toast.success('Marked as read!');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('employeeToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n._id !== id));

      toast.success('Deleted notification!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="notification-panel">Loading...</div>;

  return (
    <div className="notification-panel slide-in">
      <div className="notification-header">
        <span>Notifications</span>
        <button onClick={onClose}>×</button>
      </div>
      <div className="notification-body">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map(n => (
            <div key={n._id} className={`notification-item ${n.read ? 'read' : 'unread'} ${n.type}`}>
  <div className="icon">
    {n.type === 'info' && <i className="bi bi-info-circle"></i>}
    {n.type === 'warning' && <i className="bi bi-exclamation-triangle"></i>}
    {n.type === 'success' && <i className="bi bi-check-circle"></i>}
  </div>
  <div className="notification-content">
    <div className="message">{n.message}</div>
    <div className="timestamp">{new Date(n.date).toLocaleString()}</div>
    <div className="actions">
      {!n.read && (
        <button className="btn-info" onClick={() => markAsRead(n._id)}>Mark as Read</button>
      )}
      <button className="btn-danger" onClick={() => deleteNotification(n._id)}>Delete</button>
    </div>
  </div>
</div>

          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
