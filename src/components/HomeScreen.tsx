import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
}

const apps = [
  { id: 'snake', name: 'Змейка', icon: '🐍', color: 'from-green-400 to-green-600' },
  { id: 'tetris', name: 'Тетрис', icon: '🧱', color: 'from-blue-400 to-blue-600' },
  { id: 'game2048', name: '2048', icon: '🎮', color: 'from-yellow-400 to-orange-500' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦', color: 'from-cyan-400 to-blue-500' },
  { id: 'settings', name: 'Настройки', icon: '⚙️', color: 'from-gray-400 to-gray-600' },
  { id: 'appstore', name: 'App Store', icon: '🛍', color: 'from-blue-500 to-blue-700' },
  { id: 'calculator', name: 'Калькулятор', icon: '🔢', color: 'from-gray-700 to-gray-900' },
  { id: 'clock', name: 'Часы', icon: '🕐', color: 'from-black to-gray-800' },
  { id: 'weather', name: 'Погода', icon: '🌤', color: 'from-blue-400 to-cyan-400' },
  { id: 'notes', name: 'Заметки', icon: '📝', color: 'from-yellow-300 to-yellow-500' },
  { id: 'photos', name: 'Фото', icon: '📷', color: 'from-pink-400 to-purple-500' },
  { id: 'music', name: 'Музыка', icon: '🎵', color: 'from-red-400 to-pink-500' },
  { id: 'safari', name: 'Safari', icon: '🌐', color: 'from-blue-400 to-blue-600' },
  { id: 'messages', name: 'Сообщения', icon: '💬', color: 'from-green-400 to-green-500' },
  { id: 'maps', name: 'Карты', icon: '🗺', color: 'from-green-500 to-green-700' },
  { id: 'health', name: 'Здоровье', icon: '❤️', color: 'from-red-400 to-red-600' },
];

const dockApps = ['safari', 'messages', 'music', 'appstore'];

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp }) => {
  const { settings } = useAppContext();
  const [page, setPage] = useState(0);
  const gridApps = apps.filter(a => !dockApps.includes(a.id));

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
    <div className={`w-full h-full bg-gradient-to-b ${getWallpaper()} flex flex-col pt-14`}>
      {/* App Grid */}
      <div className="flex-1 px-5 pt-4">
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {gridApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center app-icon cursor-pointer"
              onClick={() => onOpenApp(app.id)}
            >
              <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-white text-[10px] mt-1 text-center leading-tight truncate w-16">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Page Dots */}
      <div className="flex justify-center gap-1 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      {/* Dock */}
      <div className="mx-4 mb-2 px-4 py-3 glass-effect rounded-[22px]">
        <div className="flex justify-around">
          {dockApps.map(appId => {
            const app = apps.find(a => a.id === appId);
            if (!app) return null;
            return (
              <div
                key={app.id}
                className="app-icon cursor-pointer"
                onClick={() => onOpenApp(app.id)}
              >
                <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {app.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
