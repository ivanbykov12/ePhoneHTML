import React from 'react';
import { Bug, Gamepad2, Hash, Bird, Settings, ShoppingBag, Calculator, Clock, Cloud, StickyNote, Image, Music, Globe, MessageCircle, Map, Heart } from 'lucide-react';

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

  const getAppIcon = (app: string) => {
    const icons: Record<string, any> = {
      snake: Bug,
      tetris: Gamepad2,
      game2048: Hash,
      flappy: Bird,
      settings: Settings,
      appstore: ShoppingBag,
      calculator: Calculator,
      clock: Clock,
      weather: Cloud,
      notes: StickyNote,
      photos: Image,
      music: Music,
      safari: Globe,
      messages: MessageCircle,
      maps: Map,
      health: Heart,
    };
    return icons[app] || Settings;
  };

  const getAppName = (app: string): string => {
    const names: Record<string, string> = {
      snake: 'Змейка',
      tetris: 'Тетрис',
      game2048: '2048',
      flappy: 'Flappy Bird',
      settings: 'Настройки',
      appstore: 'Магазин',
      calculator: 'Калькулятор',
      clock: 'Часы',
      weather: 'Погода',
      notes: 'Заметки',
      photos: 'Фото',
      music: 'Музыка',
      safari: 'Браузер',
      messages: 'Чаты',
      maps: 'Карты',
      health: 'Здоровье',
    };
    return names[app] || app;
  };

  const Icon = getAppIcon(content || '');

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
              <Icon className="w-3 h-3 text-white" strokeWidth={2.5} />
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

export default DynamicIsland;
