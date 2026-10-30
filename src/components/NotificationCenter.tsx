import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
}

const timeAgo = (t: number): string => {
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ visible, onClose }) => {
  const { notifications, markAllRead, clearAll } = useNotifications();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-[90]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.4, bottom: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90) onClose(); }}
            className="absolute top-0 left-0 right-0 h-[75%] glass-dark rounded-b-[36px] flex flex-col overflow-hidden">
            <div className="pt-14 px-5 pb-3 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Уведомления</h2>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <>
                    <button onClick={markAllRead} className="text-blue-400 text-xs px-3 py-1.5 bg-blue-500/10 rounded-full active:scale-95 transition-transform">
                      Прочитать
                    </button>
                    <button onClick={clearAll} className="text-red-400 text-xs px-3 py-1.5 bg-red-500/10 rounded-full active:scale-95 transition-transform">
                      Очистить
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-2.5">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center pt-16">
                    <div className="text-4xl mb-3">🔕</div>
                    <div className="text-white/40 text-sm">Уведомлений нет</div>
                  </motion.div>
                ) : notifications.map(n => (
                  <motion.div key={n.id} layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className={`glass rounded-2xl p-3.5 flex items-start gap-3 ${n.read ? 'opacity-60' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-lg">{n.icon.startsWith('material:') ? '🔔' : n.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-xs font-semibold truncate">{n.appName}</span>
                        <span className="text-white/40 text-[10px] flex-shrink-0">{timeAgo(n.time)}</span>
                      </div>
                      <div className="text-white text-[13px] font-medium mt-0.5">{n.title}</div>
                      <div className="text-white/60 text-xs mt-0.5 line-clamp-2">{n.body}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* pull-down handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
