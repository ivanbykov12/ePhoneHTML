import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Flashlight, Camera, Calculator, Timer, X, RotateCcw, Grid3x3, Maximize2 } from 'lucide-react';

const ControlCenter: React.FC = () => {
  const { settings, setSettings, showControlCenter, setShowControlCenter } = useAppContext();
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [flashlight, setFlashlight] = useState(false);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [volume, setVolume] = useState(70);
  const [isClosing, setIsClosing] = useState(false);

  const isPad = settings.phoneModel === 'epad101';

  useEffect(() => { setSettings(s => ({ ...s, darkMode, brightness })); }, [darkMode, brightness]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { setShowControlCenter(false); setIsClosing(false); }, 300);
  };

  if (!showControlCenter && !isClosing) return null;

  const animClass = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const positionClass = isPad ? 'right-0 top-0 h-full w-[400px]' : 'top-0 right-0 left-0 h-full';

  return (
    <div className={`absolute inset-0 z-[100] ${animClass}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleClose} />
      
      <div className={`absolute ${positionClass} glass-dark overflow-hidden`}>
        <div className="p-6 pt-14 h-full overflow-y-auto">
          {/* Close Button */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20 transition-all z-10">
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-6">
            {isPad ? 'Пункт управления' : 'Control Center'}
          </div>

          {/* Connectivity */}
          <div className="glass rounded-3xl p-5 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton active={wifi} onClick={() => setWifi(!wifi)} icon={<Wifi className="w-6 h-6" />} label="Wi-Fi" />
              <ToggleButton active={bluetooth} onClick={() => setBluetooth(!bluetooth)} icon={<Bluetooth className="w-6 h-6" />} label="Bluetooth" />
              <ToggleButton active={darkMode} onClick={() => setDarkMode(!darkMode)} 
                icon={darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />} label="Тема" />
              <ToggleButton active={flashlight} onClick={() => setFlashlight(!flashlight)} 
                icon={<Flashlight className="w-6 h-6" />} label="Фонарик" />
            </div>
          </div>

          {/* Brightness & Volume */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-yellow-400" />
                <span className="text-white/70 text-sm">Яркость</span>
              </div>
              <input type="range" min="30" max="100" value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-yellow-400" />
              <div className="text-center text-white/40 text-xs mt-2">{brightness}%</div>
            </div>

            <div className="glass rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-white/70" />
                <span className="text-white/70 text-sm">Громкость</span>
              </div>
              <input type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-white" />
              <div className="text-center text-white/40 text-xs mt-2">{volume}%</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <QuickButton icon={<Timer className="w-6 h-6" />} />
            <QuickButton icon={<Calculator className="w-6 h-6" />} />
            <QuickButton icon={<Camera className="w-6 h-6" />} />
            <QuickButton icon={<RotateCcw className="w-6 h-6" />} />
          </div>

          {/* Multi-tasking (iPad only) */}
          {isPad && (
            <div className="glass rounded-3xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Grid3x3 className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Мультизадачность</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={settings.multiTasking}
                    onChange={() => setSettings(s => ({ ...s, multiTasking: !s.multiTasking }))} />
                  <span className="slider"></span>
                </label>
              </div>
              {settings.multiTasking && (
                <div className="text-white/50 text-xs">
                  Приложения будут открываться в окнах
                </div>
              )}
            </div>
          )}

          {/* Now Playing */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🎵</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">Не воспроизводится</div>
                <div className="text-white/50 text-xs">Музыка</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .switch { position: relative; width: 50px; height: 30px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background: rgba(255,255,255,0.2); border-radius: 30px; transition: 0.3s; }
        .slider:before { content: ''; position: absolute; height: 24px; width: 24px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
        input:checked + .slider { background: #34c759; }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
};

const ToggleButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${
      active ? 'bg-blue-500/30 border border-blue-400/50' : 'bg-white/5 border border-white/10'
    }`}>
    <span className="text-white">{icon}</span>
    <span className="text-white/70 text-xs">{label}</span>
  </button>
);

const QuickButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button className="aspect-square glass rounded-2xl flex items-center justify-center active:scale-90 transition-all">
    <span className="text-white">{icon}</span>
  </button>
);

export default ControlCenter;
