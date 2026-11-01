import React from 'react';
import { DuoState, DUO_SIZES, DUO_HINGE_WIDTH } from '../context/AppContext';

interface DuoDeviceProps {
  duoState: DuoState;
  children: React.ReactNode;
}

/**
 * ePhone Duo — раскладной device (book-style).
 * Обёртка над «стеклом» симулятора: плавная анимация ширины корпуса
 * (closed → half-open → open), визуальный шарнир посередине в открытом
 * состоянии и изменяющиеся скругления (внешние углы круглые, у шарнира — прямые).
 * Контент (children) рендерится один раз поверх всей поверхности — обои
 * перетекают через шарнир с эффектом изгиба (CSS mask).
 */

// Непрозрачная маска: затемнение прозрачности в полосе шарнира (эффект изгиба обоев)
const HINGE_MASK = `linear-gradient(to right,
  rgba(0,0,0,1) 0%,
  rgba(0,0,0,1) calc(50% - ${DUO_HINGE_WIDTH / 2}px),
  rgba(0,0,0,0.82) calc(50% - ${DUO_HINGE_WIDTH / 4}px),
  rgba(0,0,0,0.75) 50%,
  rgba(0,0,0,0.82) calc(50% + ${DUO_HINGE_WIDTH / 4}px),
  rgba(0,0,0,1) calc(50% + ${DUO_HINGE_WIDTH / 2}px),
  rgba(0,0,0,1) 100%)`;

const DuoDevice: React.FC<DuoDeviceProps> = ({ duoState, children }) => {
  const size = DUO_SIZES[duoState];
  const isOpen = duoState === 'open';
  const isHalf = duoState === 'half-open';
  const showHinge = size.width > 400; // по ТЗ: шарнир при ширине > 400px

  return (
    <div
      className="relative bg-black overflow-hidden phone-shadow"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        // внешние углы круглые, при раскрытии сильнее скруглены; у шарнира — прямые
        borderRadius: duoState === 'closed' ? '36px' : '44px',
        border: '3px solid #2a2a2e',
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s ease',
      }}
    >
      {/* Экран-«стекло»: контент один на всю поверхность, обои перетекают через шарнир */}
      <div
        className="absolute inset-0"
        style={{
          // лёгкий наклон в полураскрытом состоянии — эффект книги под углом
          transform: isHalf ? 'perspective(1400px) rotateX(0.5deg)' : 'none',
          transition: 'transform 0.6s ease',
          ...(showHinge ? { WebkitMaskImage: HINGE_MASK, maskImage: HINGE_MASK } : {}),
        }}
      >
        {children}
      </div>

      {/* Шарнир (hinge): тёмный градиент, имитирующий физическую щель между экранами */}
      {showHinge && (
        <div
          className="absolute top-0 bottom-0 left-1/2 z-[95] pointer-events-none"
          style={{
            width: `${DUO_HINGE_WIDTH}px`,
            transform: 'translateX(-50%)',
            background:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 22%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.85) 78%, rgba(0,0,0,0) 100%)',
            boxShadow: isHalf ? '0 0 24px 6px rgba(0,0,0,0.85)' : '0 0 14px 2px rgba(0,0,0,0.6)',
            opacity: isHalf ? 0.9 : 1,
            transition: 'opacity 0.6s ease, box-shadow 0.6s ease',
          }}
        >
          {/* блик металла по оси шарнира */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(120,120,135,0.35) 15%, rgba(120,120,135,0.35) 85%, transparent)' }} />
        </div>
      )}

      {/* Декоративные петли шарнира сверху/снизу (только полностью открыт) */}
      {isOpen && (
        <>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[34px] h-[10px] rounded-full z-[96] pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #3a3a40, #17171a)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15)' }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[34px] h-[10px] rounded-full z-[96] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #3a3a40, #17171a)', boxShadow: 'inset 0 -1px 2px rgba(255,255,255,0.15)' }} />
        </>
      )}

      {/* Свет/тень на половинах экрана для объёма раскрытого корпуса */}
      {showHinge && (
        <div className="absolute inset-0 pointer-events-none z-[94]"
          style={{
            background: isHalf
              ? 'linear-gradient(to right, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%)'
              : 'linear-gradient(to right, rgba(255,255,255,0.03), transparent 25%, transparent 75%, rgba(255,255,255,0.03))',
          }} />
      )}
    </div>
  );
};

export default DuoDevice;
