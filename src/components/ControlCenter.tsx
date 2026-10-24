import React, { useState, useEffect } from 'react';
import { useAppContext, PhoneModel } from '../context/AppContext';
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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setSettings(s => ({ ...s, darkMode, brightness }));
  }, [darkMode, brightness]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowControlCenter(false);
      setIsAnimating(false);
    }, 300);
  };

  if (!showControlCenter && !isAnimating) return null;

  // Для iPhone 8 - открытие снизу
  const isIPhone8 = settings.phoneModel === 'iphone8';
  
  const animationClass = isAnimating 
    ? (isIPhone8 ? 'animate-slide-down' : 'animate-fade-out')
    : (isIPhone8 ? 'animate-slide-up' : 'animate-fade-in');

  const positionClass = isIPhone8 
    ? 'bottom-0 top-auto rounded-t-3xl' 
    : 'top-0 right-0 rounded-bl-3xl';

  return (
    <div className={`absolute inset-0 z-[100] ${animationClass}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Control Center Panel */}
      <div className={`absolute ${positionClass} w-full ${isIPhone8 ? 'h-[70%]' : 'h-full'} bg-gray-900/95 backdrop-blur-2xl p-4 pt-12 overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-white text-lg font-bold mb-4">Control Center</div>

        {/* Grid Layout */}
        <div className="space-y-3">
          {/* Top Row - Connectivity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWifi(!wifi)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${wifi ? 'bg-blue-500' : 'bg-white/20'}`}
                >
                  <Wifi className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => setBluetooth(!bluetooth)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${bluetooth ? 'bg-blue-500' : 'bg-white/20'}`}
                >
                  <Bluetooth className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => setAirplane(!airplane)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${airplane ? 'bg-orange-500' : 'bg-white/20'}`}
                >
                  <Plane className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-indigo-500' : 'bg-yellow-500'}`}
                >
                  {darkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
                </button>
              </div>
            </div>

            {/* Music Player */}
            <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🎵</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">Не воспроизводится</div>
                  <div className="text-gray-400 text-xs">Музыка</div>
                </div>
                <button
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors"
                >
                  {musicPlaying ? (
                    <div className="w-3 h-3 bg-white rounded-sm" />
                  ) : (
                    <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Brightness and Volume */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Яркость</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="text-gray-400 text-xs mt-1 text-center">{brightness}%</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Громкость</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="text-gray-400 text-xs mt-1 text-center">{volume}%</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => setFlashlight(!flashlight)}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${flashlight ? 'bg-yellow-400' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Flashlight className="w-7 h-7 text-white" />
            </button>
            <button className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <Timer className="w-7 h-7 text-white" />
            </button>
            <button className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <Calculator className="w-7 h-7 text-white" />
            </button>
            <button className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <Camera className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Screen Rotation */}
          <div className="bg-white/10 rounded-2xl p-4">
            <button className="flex items-center gap-3 text-white w-full">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-sm">Портретная ориентация</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
