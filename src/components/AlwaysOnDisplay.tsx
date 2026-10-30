import React from 'react';
import { useAppContext, AODPosition } from '../context/AppContext';

interface AODProps {
  time: Date;
  onTapWake: () => void;
}

const POSITION_STYLE: Record<AODPosition, React.CSSProperties> = {
  'top-left': { top: '15%', left: '0', alignItems: 'flex-start', textAlign: 'left' },
  'top-center': { top: '15%', left: '0', right: '0', alignItems: 'center', textAlign: 'center' },
  'top-right': { top: '15%', right: '0', alignItems: 'flex-end', textAlign: 'right' },
  'center': { top: '42%', left: '0', right: '0', alignItems: 'center', textAlign: 'center' },
  'bottom-left': { bottom: '18%', left: '0', alignItems: 'flex-start', textAlign: 'left' },
  'bottom-center': { bottom: '18%', left: '0', right: '0', alignItems: 'center', textAlign: 'center' },
  'bottom-right': { bottom: '18%', right: '0', alignItems: 'flex-end', textAlign: 'right' },
};

const AlwaysOnDisplay: React.FC<AODProps> = ({ time, onTapWake }) => {
  const { settings } = useAppContext();

  if (!settings.aodEnabled) return null;

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
  const posStyle = POSITION_STYLE[settings.aodPosition] || POSITION_STYLE['top-center'];

  return (
    <div
      className="absolute inset-0 z-[60] bg-black cursor-pointer select-none overflow-hidden"
      style={{ borderRadius: 'inherit' }}
      onClick={onTapWake}
      onTouchStart={onTapWake}>
      {/* Едва заметное радиальное свечение, имитирующее OLED AOD */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.045) 0%, rgba(0,0,0,0) 60%)' }} />

      {/* Часы и дата в выбранном положении */}
      <div className="absolute flex flex-col" style={posStyle}>
        <div className="text-white/75 font-extralight tracking-tight" style={{ fontSize: '64px', lineHeight: 1.05 }}>
          {timeStr}
        </div>
        <div className="text-white/35 text-sm mt-2 capitalize font-light">{dateStr}</div>
      </div>

      {/* Индикатор батареи внизу по центру */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <span className="text-white/25 text-[11px] tracking-wide">{settings.brightness}% · AOD</span>
      </div>

      {/* Подсказка о пробуждении */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <span className="text-white/20 text-[11px] animate-pulse">Нажмите, чтобы включить экран</span>
      </div>
    </div>
  );
};

export default AlwaysOnDisplay;
