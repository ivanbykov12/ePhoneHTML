import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wifi, Bluetooth, Plane, Moon, Sun, Volume2, VolumeX, Flashlight, Camera, Calculator, Timer, RotateCcw } from 'lucide-react';

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

  useEffect(() => {
    setSettings(s => ({ ...s, darkMode, brightness }));
  }, [darkMode, brightness]);

  if (!showControlCenter) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-end p-2 pt-12">
      <div 
        className="w-full h-full bg-black/80 backdrop-blur-2xl rounded-3xl p-4 animate-slide-down"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowControlCenter(false);
        }}
      >
        <div className="grid grid-cols-4 gap-3 h-full">
          {/* Top Row - Connectivity */}
          <div className="col-span-2 bg-gray-800/80 rounded-2xl p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWifi(!wifi)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${wifi ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <Wifi className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setBluetooth(!bluetooth)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${bluetooth ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <Bluetooth className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setAirplane(!airplane)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${airplane ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <Plane className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-500' : 'bg-yellow-500'}`}
              >
                {darkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Music Player */}
          <div className="col-span-2 bg-gray-800/80 rounded-2xl p-3 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Не воспроизводится</div>
                <div className="text-gray-400 text-xs">Музыка</div>
              </div>
              <button
                onClick={() => setMusicPlaying(!musicPlaying)}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
              >
                {musicPlaying ? (
                  <div className="w-3 h-3 bg-white rounded-sm" />
                ) : (
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Brightness */}
          <div className="col-span-1 bg-gray-800/80 rounded-2xl p-3 flex flex-col items-center justify-center">
            <Sun className="w-5 h-5 text-white mb-2" />
            <div className="w-8 h-24 bg-gray-700 rounded-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-white rounded-full transition-all"
                style={{ height: `${brightness}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rotate-[-90deg]"
              />
            </div>
          </div>

          {/* Volume */}
          <div className="col-span-1 bg-gray-800/80 rounded-2xl p-3 flex flex-col items-center justify-center">
            <Volume2 className="w-5 h-5 text-white mb-2" />
            <div className="w-8 h-24 bg-gray-700 rounded-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-white rounded-full transition-all"
                style={{ height: `${volume}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rotate-[-90deg]"
              />
            </div>
          </div>

          {/* Bottom Row - Quick Actions */}
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setFlashlight(!flashlight)}
              className={`aspect-square rounded-2xl flex items-center justify-center ${flashlight ? 'bg-yellow-400' : 'bg-gray-800/80'}`}
            >
              <Flashlight className="w-6 h-6 text-white" />
            </button>
            <button className="aspect-square bg-gray-800/80 rounded-2xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </button>
            <button className="aspect-square bg-gray-800/80 rounded-2xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </button>
            <button className="aspect-square bg-gray-800/80 rounded-2xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Screen Rotation */}
          <div className="col-span-2 bg-gray-800/80 rounded-2xl p-3 flex items-center justify-center">
            <button className="flex items-center gap-2 text-white">
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm">Портретная ориентация</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
