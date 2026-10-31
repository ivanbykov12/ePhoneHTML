import React from 'react';
import { useAppContext, AODPosition } from '../context/AppContext';

interface AODProps {
  time: Date;
  onTapWake: () => void;
  /** Нижняя «мертвая зона» (home-кнопка iPhone 8 / bezel), px — контент AOD не залезает на неё */
  bottomInset?: number;
}

const buildPositionStyle = (pos: AODPosition, bottomInset: number): React.CSSProperties => {
  // нижние позиции поднимаем над нижней рамкой (безель/home-кнопка)
  const b = `calc(18% + ${bottomInset}px)`;
  switch (pos) {
    case 'top-left': return { top: '15%', left: '0', alignItems: 'flex-start', textAlign: 'left' };
    case 'top-center': return { top: '15%', left: '0', right: '0', alignItems: 'center', textAlign: 'center' };
    case 'top-right': return { top: '15%', right: '0', alignItems: 'flex-end', textAlign: 'right' };
    case 'center': return { top: '42%', left: '0', right: '0', alignItems: 'center', textAlign: 'center' };
    case 'bottom-left': return { bottom: b, left: '0', alignItems: 'flex-start', textAlign: 'left' };
    case 'bottom-center': return { bottom: b, left: '0', right: '0', alignItems: 'center', textAlign: 'center' };
    case 'bottom-right': return { bottom: b, right: '0', alignItems: 'flex-end', textAlign: 'right' };
  }
};

const AlwaysOnDisplay: React.FC<AODProps> = ({ time, onTapWake, bottomInset = 0 }) => {
  const { settings } = useAppContext();

  if (!settings.aodEnabled) return null;

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
  const posStyle = buildPositionStyle(settings.aodPosition, bottomInset);

  return (
    <div
      className="absolute inset-0 z-[60] bg-black cursor-pointer select-none overflow-hidden"
      style={{ borderRadius: 'inherit' }}
      onClick={onTapWake}>
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

      {/* Индикатор батареи внизу по центру (над нижней рамкой) */}
      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 24 + bottomInset }}>
        <span className="text-white/25 text-[11px] tracking-wide">{settings.brightness}% · AOD</span>
      </div>

      {/* Подсказка о пробуждении (над нижней рамкой) */}
      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 48 + bottomInset }}>
        <span className="text-white/20 text-[11px] animate-pulse">Нажмите, чтобы включить экран</span>
      </div>
    </div>
  );
};

export default AlwaysOnDisplay;
