import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface LockScreenProps {
  time: Date;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ time, onUnlock }) => {
  const { settings } = useAppContext();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragY(Math.max(0, clientY - 700));
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) onUnlock();
    setDragY(0);
  };

  const getWallpaper = () => {
    const wallpapers: Record<string, string> = {
      gradient1: 'from-purple-900 via-blue-900 to-black',
      gradient2: 'from-pink-900 via-red-900 to-orange-900',
      gradient3: 'from-green-900 via-teal-900 to-cyan-900',
      gradient4: 'from-indigo-900 via-purple-900 to-pink-900',
      dark: 'from-gray-900 to-black',
    };
    return wallpapers[settings.wallpaper] || wallpapers.gradient1;
  };

  return (
    <div
      className={`w-full h-full bg-gradient-to-b ${getWallpaper()} flex flex-col items-center transition-transform duration-200`}
      style={{ transform: `translateY(-${dragY * 0.3}px)` }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Time */}
      <div className="mt-24 text-center">
        <div className="text-white text-7xl font-thin tracking-tight">{timeStr}</div>
        <div className="text-white/70 text-lg mt-2 capitalize">{dateStr}</div>
      </div>

      {/* Notifications */}
      <div className="mt-12 w-full px-6 space-y-3">
        <div className="glass-effect rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">📱</div>
          <div className="flex-1">
            <div className="text-white text-xs font-semibold">iPhone Simulator</div>
            <div className="text-white/70 text-xs">Свайпни вверх для разблокировки</div>
          </div>
          <span className="text-white/50 text-xs">сейчас</span>
        </div>
        <div className="glass-effect rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-sm">🎮</div>
          <div className="flex-1">
            <div className="text-white text-xs font-semibold">Игры</div>
            <div className="text-white/70 text-xs">3 игры доступны</div>
          </div>
          <span className="text-white/50 text-xs">2м</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-8 flex flex-col items-center">
        <div className="text-white/50 text-xs mb-2 animate-pulse">Свайпни вверх</div>
        <div className="w-10 h-1 bg-white/30 rounded-full" />
      </div>

      {/* Flashlight & Camera */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-between px-12">
        <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center text-xl cursor-pointer active:scale-90 transition-transform">
          🔦
        </div>
        <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center text-xl cursor-pointer active:scale-90 transition-transform">
          📷
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
