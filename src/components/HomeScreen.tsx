import React from 'react';
import { useAppContext, getStatusBarPadding } from '../context/AppContext';
import {
  Bug, Gamepad2, Hash, Bird, Settings, ShoppingBag, Calculator,
  Clock, Cloud, StickyNote, Image, Music, Globe, MessageCircle,
  Map, Heart
} from 'lucide-react';

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
}

const apps = [
  { id: 'snake', name: 'Змейка', Icon: Bug, color: 'from-green-400 to-green-600' },
  { id: 'tetris', name: 'Тетрис', Icon: Gamepad2, color: 'from-blue-400 to-blue-600' },
  { id: 'game2048', name: '2048', Icon: Hash, color: 'from-yellow-400 to-orange-500' },
  { id: 'flappy', name: 'Flappy', Icon: Bird, color: 'from-cyan-400 to-blue-500' },
  { id: 'settings', name: 'Настройки', Icon: Settings, color: 'from-gray-400 to-gray-600' },
  { id: 'appstore', name: 'Магазин', Icon: ShoppingBag, color: 'from-blue-500 to-blue-700' },
  { id: 'calculator', name: 'Калькул.', Icon: Calculator, color: 'from-gray-700 to-gray-900' },
  { id: 'clock', name: 'Часы', Icon: Clock, color: 'from-black to-gray-800' },
  { id: 'weather', name: 'Погода', Icon: Cloud, color: 'from-blue-400 to-cyan-400' },
  { id: 'notes', name: 'Заметки', Icon: StickyNote, color: 'from-yellow-300 to-yellow-500' },
  { id: 'photos', name: 'Фото', Icon: Image, color: 'from-pink-400 to-purple-500' },
  { id: 'music', name: 'Музыка', Icon: Music, color: 'from-red-400 to-pink-500' },
  { id: 'safari', name: 'Браузер', Icon: Globe, color: 'from-blue-400 to-blue-600' },
  { id: 'messages', name: 'Чаты', Icon: MessageCircle, color: 'from-green-400 to-green-500' },
  { id: 'maps', name: 'Карты', Icon: Map, color: 'from-green-500 to-green-700' },
  { id: 'health', name: 'Здоровье', Icon: Heart, color: 'from-red-400 to-red-600' },
];

const dockApps = ['safari', 'messages', 'music', 'appstore'];

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp }) => {
  const { settings } = useAppContext();
  const paddingTop = getStatusBarPadding(settings.phoneModel);
  const gridApps = apps.filter(a => !dockApps.includes(a.id));

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

  return (
    <div className={`w-full h-full bg-gradient-to-b ${getWallpaper()} flex flex-col`} style={{ paddingTop }}>
      {/* App Grid */}
      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {gridApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center app-icon cursor-pointer"
              onClick={() => onOpenApp(app.id)}
            >
              <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                <app.Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
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
      <div className="mx-4 mb-4 px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[22px]">
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
                <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                  <app.Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
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
