import React from 'react';
import { X, Bell } from 'lucide-react';

export interface SimNotification {
  id: number;
  appId: string;
  title: string;
  body: string;
  time: number;
}

interface NotificationCenterProps {
  notifications: SimNotification[];
  onDismiss: (id: number) => void;
  onClose: () => void;
  onOpenApp?: (appId: string) => void;
}

const formatTime = (t: number) =>
  new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications, onDismiss, onClose, onOpenApp,
}) => {
  return (
    <div className="absolute inset-0 z-[110] animate-fade-in">
      {/* Затемнение с blur — тап по нему закрывает центр */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={onClose} />

      {/* Шапка */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-14 pb-3 z-10">
        <span className="text-white text-lg font-bold">Уведомления</span>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:bg-white/30">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Список уведомлений */}
      <div className="absolute inset-x-0 top-[76px] bottom-0 overflow-y-auto px-4 pb-24 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-32 opacity-50">
            <Bell className="w-8 h-8 text-white mb-2" />
            <span className="text-white text-sm">Нет уведомлений</span>
          </div>
        ) : (
          [...notifications].reverse().map(n => (
            <div key={n.id}
              className="glass-strong rounded-2xl p-3.5 shadow-lg notif-enter cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => { if (onOpenApp && n.appId) onOpenApp(n.appId); }}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-sm font-semibold leading-tight">{n.title}</span>
                <span className="text-white/40 text-[10px] flex-shrink-0 mt-0.5">{formatTime(n.time)}</span>
              </div>
              <div className="text-white/70 text-xs mt-1 leading-snug">{n.body}</div>
              <button
                className="mt-2 text-[10px] text-blue-400 font-medium active:opacity-70"
                onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}>
                Убрать
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
