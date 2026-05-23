const NotificationCard = ({ notification, onMarkRead }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-700">{notification.message}</p>
        {!notification.readStatus && (
          <button
            className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700"
            onClick={() => onMarkRead(notification._id)}
          >
            Mark read
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default NotificationCard;
