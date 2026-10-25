import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface DynamicIslandProps {
  content: string | null;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { customApps } = useAppContext();

  useEffect(() => {
    if (content) {
      setIsAnimating(true);
      setExpanded(true);
      const timer = setTimeout(() => {
        setExpanded(false);
        setTimeout(() => setIsAnimating(false), 400);
      }, 2500);
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
        color: app.color || 'from-gray-400 to-gray-600',
      };
    }
    return { name: appId, icon: '📱', isMaterial: false, color: 'from-gray-400 to-gray-600' };
  };

  const info = getAppInfo(content || '');

  const { settings } = useAppContext();
  const isPad = settings.phoneModel === 'epad101';

  return (
    <div className={`absolute top-[11px] z-50 flex items-center justify-center ${isPad ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}>
      <div
        className={`bg-black flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? 'w-[200px] h-10 rounded-[22px]' : 'w-28 h-8 rounded-full'
        }`}
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)',
        }}
        onClick={() => {
          if (content) {
            setExpanded(!expanded);
          }
        }}
      >
        {expanded && content && (
          <div className="flex items-center gap-2.5 px-3 animate-fade-in w-full">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {info.isMaterial ? (
                <span className="material-icons text-white" style={{ fontSize: '12px' }}>{info.icon}</span>
              ) : (
                <span style={{ fontSize: '12px' }}>{info.icon}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[11px] font-semibold truncate">{info.name}</div>
              <div className="text-green-400 text-[9px] font-medium">Активно</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicIsland;
