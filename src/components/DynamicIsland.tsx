import React from 'react';

interface DynamicIslandProps {
  content: string | null;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ content }) => {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (content) {
      setExpanded(true);
      const timer = setTimeout(() => setExpanded(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [content]);

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
              <span className="text-[8px] text-white">✓</span>
            </div>
            <span className="text-white text-xs font-medium truncate">
              {getAppName(content)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function getAppName(app: string): string {
  const names: Record<string, string> = {
    snake: '🐍 Змейка',
    tetris: '🧱 Тетрис',
    game2048: '🎮 2048',
    settings: '⚙️ Настройки',
    appstore: '🛍 App Store',
    calculator: '🔢 Калькулятор',
    clock: '🕐 Часы',
    weather: '🌤 Погода',
    notes: '📝 Заметки',
    photos: '📷 Фото',
    music: '🎵 Музыка',
    safari: '🌐 Safari',
  };
  return names[app] || app;
}

export default DynamicIsland;
