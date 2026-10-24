import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wifi, Bluetooth, Plane, Moon, Sun, Volume2, Flashlight, Camera, Calculator, Timer, X, RotateCcw } from 'lucide-react';

const ControlCenter: React.FC = () => {
  const { settings, setSettings, showControlCenter, setShowControlCenter } = useAppContext();
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [flashlight, setFlashlight] = useState(false);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [volume, setVolume] = useState(70);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => { setSettings(s => ({ ...s, darkMode, brightness })); }, [darkMode, brightness]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { setShowControlCenter(false); setIsClosing(false); }, 300);
  };

  if (!showControlCenter && !isClosing) return null;

  const isIPhone8 = settings.phoneModel === 'iphone8';
  const animClass = isClosing
    ? (isIPhone8 ? 'animate-slide-to-bottom' : 'animate-fade-out')
    : (isIPhone8 ? 'animate-slide-from-bottom' : 'animate-slide-down');

  return (
    <div className={`absolute inset-0 z-[100] ${animClass}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleClose} />
      
      <div className={`absolute ${isIPhone8 ? 'bottom-0 left-0 right-0 h-[75%] rounded-t-[30px]' : 'top-0 right-0 left-0 h-full rounded-b-[30px]'} glass-dark overflow-hidden`}>
        <div className="p-5 pt-12 h-full overflow-y-auto">
          {/* Close Button */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20 transition-all z-10">
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Пункт управления</div>

          {/* Connectivity & Music */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="glass rounded-2xl p-3">
              <div className="grid grid-cols-2 gap-2">
                <ToggleButton active={wifi} onClick={() => setWifi(!wifi)} color="blue">
                  <Wifi className="w-5 h-5" />
                </ToggleButton>
                <ToggleButton active={bluetooth} onClick={() => setBluetooth(!bluetooth)} color="blue">
                  <Bluetooth className="w-5 h-5" />
                </ToggleButton>
                <ToggleButton active={airplane} onClick={() => setAirplane(!airplane)} color="orange">
                  <Plane className="w-5 h-5" />
                </ToggleButton>
                <ToggleButton active={darkMode} onClick={() => setDarkMode(!darkMode)} color="indigo">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </ToggleButton>
              </div>
            </div>

            <div className="glass rounded-2xl p-3 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">Не воспроизводится</div>
                  <div className="text-white/50 text-[10px]">Музыка</div>
                </div>
              </div>
            </div>
          </div>

          {/* Brightness & Volume */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="glass rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70 text-xs">Яркость</span>
              </div>
              <div className="relative h-24 flex items-center justify-center">
                <div className="w-8 h-full bg-white/10 rounded-full overflow-hidden relative">
                  <div className="absolute bottom-0 w-full bg-white rounded-full transition-all duration-200" style={{ height: `${brightness}%` }} />
                </div>
                <input type="range" min="30" max="100" value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
              </div>
              <div className="text-center text-white/40 text-[10px] mt-1">{brightness}%</div>
            </div>

            <div className="glass rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-xs">Громкость</span>
              </div>
              <div className="relative h-24 flex items-center justify-center">
                <div className="w-8 h-full bg-white/10 rounded-full overflow-hidden relative">
                  <div className="absolute bottom-0 w-full bg-white rounded-full transition-all duration-200" style={{ height: `${volume}%` }} />
                </div>
                <input type="range" min="0" max="100" value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
              </div>
              <div className="text-center text-white/40 text-[10px] mt-1">{volume}%</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <QuickButton active={flashlight} onClick={() => setFlashlight(!flashlight)}>
              <Flashlight className="w-6 h-6" />
            </QuickButton>
            <QuickButton><Timer className="w-6 h-6" /></QuickButton>
            <QuickButton><Calculator className="w-6 h-6" /></QuickButton>
            <QuickButton><Camera className="w-6 h-6" /></QuickButton>
          </div>

          {/* Rotation Lock */}
          <div className="glass rounded-2xl p-3">
            <button className="flex items-center gap-3 text-white/70 w-full">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-xs">Портретная ориентация</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleButton: React.FC<{ active: boolean; onClick: () => void; color: string; children: React.ReactNode }> = ({ active, onClick, color, children }) => {
  const colorClasses: Record<string, string> = {
    blue: active ? 'bg-blue-500' : 'bg-white/10',
    orange: active ? 'bg-orange-500' : 'bg-white/10',
    indigo: active ? 'bg-indigo-500' : 'bg-white/10',
  };
  return (
    <button onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${colorClasses[color]}`}>
      <span className="text-white">{children}</span>
    </button>
  );
};

const QuickButton: React.FC<{ active?: boolean; onClick?: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-90 ${active ? 'bg-yellow-400' : 'glass'}`}>
    <span className="text-white">{children}</span>
  </button>
);

export default ControlCenter;
