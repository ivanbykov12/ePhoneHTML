import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface LockScreenProps {
  time: Date;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ time, onUnlock }) => {
  const { settings } = useAppContext();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = startY - clientY;
    setDragY(Math.max(0, diff));
  };

  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragY > 80) onUnlock();
      setDragY(0);
    }
  };

  // Handle global mouseup/touchend to prevent stuck dragging
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        if (dragY > 80) onUnlock();
        setDragY(0);
      }
    };
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, dragY, onUnlock]);

  const getWallpaper = () => {
    const wallpapers: Record<string, string> = {
      gradient1: 'from-indigo-900 via-purple-800 to-black',
      gradient2: 'from-rose-900 via-orange-800 to-amber-900',
      gradient3: 'from-emerald-900 via-teal-800 to-cyan-900',
      gradient4: 'from-violet-900 via-fuchsia-800 to-pink-900',
      dark: 'from-gray-900 to-black',
    };
    return wallpapers[settings.wallpaper] || wallpapers.gradient1;
  };

  const opacity = Math.max(0, 1 - dragY / 200);

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${getWallpaper()} flex flex-col items-center relative overflow-hidden`}
      style={{ opacity }}
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Background blur circles */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl" />

      {/* Time */}
      <div className="mt-20 text-center z-10">
        <div className="text-white text-8xl font-extralight tracking-tight drop-shadow-2xl">
          {timeStr}
        </div>
        <div className="text-white/60 text-base mt-3 capitalize font-light">
          {dateStr}
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-10 w-full px-5 space-y-2 z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold">ePhone Simulator</div>
            <div className="text-white/60 text-xs truncate">Свайпни вверх для разблокировки</div>
          </div>
          <span className="text-white/40 text-[10px]">сейчас</span>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold">Игры</div>
            <div className="text-white/60 text-xs truncate">4 игры доступны — Змейка, Тетрис, 2048, Flappy Bird</div>
          </div>
          <span className="text-white/40 text-[10px]">2м</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-between px-10 z-10">
        <div className="w-12 h-12 backdrop-blur-xl bg-white/15 border border-white/20 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="w-12 h-12 backdrop-blur-xl bg-white/15 border border-white/20 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center z-10">
        <svg className="w-5 h-5 text-white/40 animate-bounce mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </div>
  );
};

export default LockScreen;
