import React from 'react';
import { SimNotification } from './NotificationCenter';

interface NotificationBannerProps {
  notification: SimNotification;
  onTap: () => void;
}

// Всплывающий баннер «в реальном времени»: появляется сверху, живёт ~5 сек
const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onTap }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-[120] px-3 pt-12 pointer-events-none">
      <div onClick={onTap}
        className="pointer-events-auto glass-strong rounded-[22px] p-3.5 shadow-2xl cursor-pointer active:scale-[0.97] transition-transform notif-banner-enter">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm font-bold">{notification.title.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-white text-[13px] font-semibold truncate">{notification.title}</span>
              <span className="text-white/40 text-[10px] flex-shrink-0">сейчас</span>
            </div>
            <div className="text-white/70 text-xs mt-0.5 line-clamp-2 leading-snug">{notification.body}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
