import { useEffect, useState } from 'react';
import api from '../api/api.js';
import NotificationCard from '../components/NotificationCard.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

const Notifications = () => {
  const { notifications, setNotifications, markAsRead } = useNotification();

  useEffect(() => {
    api.get('/notifications').then((response) => setNotifications(response.data));
  }, [setNotifications]);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    markAsRead(id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
        <p className="mt-2 text-sm text-slate-500">Stay up to date with status changes and repair updates.</p>
      </div>
      <div className="grid gap-4">
        {notifications.length > 0 ? notifications.map((notification) => (
          <NotificationCard key={notification._id} notification={notification} onMarkRead={markRead} />
        )) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">No notifications yet.</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
