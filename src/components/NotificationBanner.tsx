import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

// Всплывающий баннер нового уведомления (как на iOS)
const NotificationBanner: React.FC<{ onOpenApp: (id: string) => void }> = ({ onOpenApp }) => {
  const { notifications } = useNotifications();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!current && notifications.length > 0) {
      const fresh = notifications[0];
      if (fresh && !fresh.read) setCurrent(fresh.id);
    }
  }, [notifications, current]);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), 4500);
    return () => clearTimeout(t);
  }, [current]);

  const notif = notifications.find(n => n.id === current);
  if (!notif) return null;

  return (
    <div className="absolute top-2 left-2 right-2 z-[95] pointer-events-none">
      <AnimatePresence>
        {notif && (
          <motion.div
            key={notif.id}
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={() => { onOpenApp(notif.appId); setCurrent(null); }}
            className="glass-dark rounded-[22px] p-3 flex items-center gap-3 shadow-2xl cursor-pointer pointer-events-auto active:scale-[0.97] transition-transform">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-lg">{notif.icon.startsWith('material:') ? '🔔' : notif.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-semibold truncate">{notif.appName}</span>
                <span className="text-white/40 text-[10px]">сейчас</span>
              </div>
              <div className="text-white text-[13px] font-medium truncate">{notif.title}</div>
              <div className="text-white/60 text-xs truncate">{notif.body}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBanner;
