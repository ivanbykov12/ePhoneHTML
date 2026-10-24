import React from 'react';
import { useAppContext } from '../context/AppContext';

interface DynamicIslandProps {
  content: string | null;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ content }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { customApps } = useAppContext();

  React.useEffect(() => {
    if (content) {
      setExpanded(true);
      const timer = setTimeout(() => setExpanded(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const getAppInfo = (appId: string) => {
    const app = customApps.find(a => a.id === appId);
    if (app) {
      const isMaterial = app.icon?.startsWith('material:');
      return {
        name: app.name,
        icon: isMaterial ? app.icon.replace('material:', '') : (app.icon || '📱'),
        isMaterial: !!isMaterial,
      };
    }
    
    const names: Record<string, string> = {
      snake_system: 'Змейка',
      tetris_system: 'Тетрис',
      game2048_system: '2048',
      flappy_system: 'Flappy Bird',
      settings_system: 'Настройки',
      appstore_system: 'Магазин',
      calculator_system: 'Калькулятор',
      clock_system: 'Часы',
      weather_system: 'Погода',
      notes_system: 'Заметки',
      photos_system: 'Фото',
      music_system: 'Музыка',
      safari_system: 'Браузер',
      messages_system: 'Чаты',
      maps_system: 'Карты',
      health_system: 'Здоровье',
    };
    return { name: names[appId] || appId, icon: '📱', isMaterial: false };
  };

  const info = getAppInfo(content || '');

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`bg-black rounded-full flex items-center justify-center transition-all duration-500 ease-in-out overflow-hidden ${
          expanded ? 'w-48 h-10 rounded-[20px]' : 'w-28 h-8'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded && content && (
          <div className="flex items-center gap-2 px-3 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              {info.isMaterial ? (
                <span className="material-icons text-white" style={{ fontSize: '10px' }}>{info.icon}</span>
              ) : (
                <span style={{ fontSize: '10px' }}>{info.icon}</span>
              )}
            </div>
            <span className="text-white text-xs font-medium truncate">
              {info.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicIsland;
