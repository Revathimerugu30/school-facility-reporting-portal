import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getSocket } from '../api/socket.js';

const NotificationContext = createContext();
const notificationToneDataUri = 'data:audio/wav;base64,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}}';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationAudio = useMemo(() => {
    const audio = new Audio(notificationToneDataUri);
    audio.preload = 'auto';
    audio.volume = 0.45;
    return audio;
  }, []);

  const setNotificationsState = useCallback((notificationsList) => {
    setNotifications(notificationsList);
    setUnreadCount(notificationsList.filter((item) => !item.readStatus).length);
  }, []);

  // Add a toast notification
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, isVisible: true };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!notificationAudio) return;

    const fallback = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 880;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.35);
      } catch (error) {
        console.log('Could not play fallback notification sound:', error);
      }
    };

    try {
      notificationAudio.currentTime = 0;
      const playPromise = notificationAudio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.log('Notification audio playback blocked, using fallback tone:', error);
          fallback();
        });
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
      fallback();
    }
  }, [notificationAudio]);

  // Add notification (with sound)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Play sound
    playNotificationSound();

    // Show toast
    addToast(notification.message, 'info', 5000);
  }, [addToast, playNotificationSound]);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif._id === id ? { ...notif, readStatus: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Socket connection for real-time notifications
  useEffect(() => {
    const socket = getSocket();

    socket.on('notification', (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off('notification');
    };
  }, [addNotification]);

  const value = {
    notifications,
    toasts,
    unreadCount,
    addToast,
    removeToast,
    addNotification,
    markAsRead,
    setNotifications: setNotificationsState,
    playNotificationSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
