import React, { createContext, useContext } from 'react';

export interface AppNotification {
  id: string;
  appId: string;
  appName: string;
  icon: string; // emoji или material:xxx
  color: string; // tailwind gradient
  title: string;
  body: string;
  time: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  markAllRead: () => {},
  clearAll: () => {},
  unreadCount: 0,
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ephone_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    // Храним только последние 30 уведомлений
    localStorage.setItem('ephone_notifications', JSON.stringify(notifications.slice(0, 30)));
  }, [notifications]);

  const addNotification = (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const notif: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: Date.now(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev].slice(0, 30));
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
