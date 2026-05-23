import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../context/NotificationContext.jsx';
import api from '../api/api.js';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef(null);
  const { notifications, unreadCount, markAsRead, setNotifications } = useNotification();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [setNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.readStatus);
      await Promise.all(unreadNotifications.map((n) => api.put(`/notifications/${n._id}/read`)));
      setNotifications(notifications.map((n) => ({ ...n, readStatus: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (message) => {
    if (message.includes('updated')) return '🔄';
    if (message.includes('submitted')) return '📋';
    if (message.includes('assigned')) return '👤';
    return '🔔';
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Notifications</h3>
              <p className="text-xs text-slate-300 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-500">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <BellIcon className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No notifications yet</p>
                <p className="text-xs text-slate-500 text-center mt-1">
                  You'll receive notifications when issues are updated
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-6 py-4 transition-colors hover:bg-slate-50 cursor-pointer ${
                      notification.readStatus ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-lg mt-1">
                        {getNotificationIcon(notification.message)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${notification.readStatus ? 'text-slate-700' : 'font-semibold text-slate-900'}`}>
                            {notification.message}
                          </p>
                          {!notification.readStatus && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="flex-shrink-0 text-sky-600 hover:text-sky-700 transition-colors"
                              title="Mark as read"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
