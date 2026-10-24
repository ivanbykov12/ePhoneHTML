import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import AppRenderer from './components/AppRenderer';
import { AppContext, SystemSettings, defaultSettings, PhoneModel } from './context/AppContext';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [islandContent, setIslandContent] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appName: string) => {
    setCurrentApp(appName);
    setIslandContent(appName);
    setTimeout(() => setIslandContent(null), 3000);
  };

  const closeApp = () => {
    setCurrentApp(null);
  };

  const lockPhone = () => {
    setIsLocked(true);
    setCurrentApp(null);
  };

  const unlockPhone = () => {
    setIsLocked(false);
  };

  // Phone frame dimensions based on model
  const getFrameStyle = () => {
    switch (settings.phoneModel) {
      case 'iphone8':
        return {
          width: '375px',
          height: '667px',
          borderRadius: '40px',
          border: '4px solid #333',
          boxShadow: '0 0 0 2px #1a1a1a, 0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #444',
        };
      case 'iphonex':
        return {
          width: '375px',
          height: '812px',
          borderRadius: '44px',
          border: '4px solid #333',
          boxShadow: '0 0 0 2px #1a1a1a, 0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #444',
        };
      case 'iphone14':
        return {
          width: '390px',
          height: '844px',
          borderRadius: '50px',
          border: '4px solid #333',
          boxShadow: '0 0 0 2px #1a1a1a, 0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #444',
        };
    }
  };

  const showIsland = settings.phoneModel === 'iphone14' && !settings.disableIsland;
  const hasNotch = settings.phoneModel === 'iphonex';
  const hasHomeButton = settings.phoneModel === 'iphone8';

  // Responsive scaling for mobile
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const frameH = settings.phoneModel === 'iphone8' ? 667 : settings.phoneModel === 'iphonex' ? 812 : 844;
      const frameW = settings.phoneModel === 'iphone8' ? 375 : settings.phoneModel === 'iphonex' ? 375 : 390;
      const scaleH = (vh - 40) / frameH;
      const scaleW = (vw - 20) / frameW;
      setScale(Math.min(1, scaleH, scaleW));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [settings.phoneModel]);

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
        {/* ePhone Frame */}
        <div
          className="relative bg-black overflow-hidden"
          style={{
            ...getFrameStyle(),
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Dynamic Island (ePhone 14 only) */}
          {showIsland && <DynamicIsland content={islandContent} />}

          {/* Notch (ePhone X) */}
          {hasNotch && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50" />
          )}

          {/* Status Bar */}
          <StatusBar time={time} model={settings.phoneModel} />

          {/* Main Content */}
          <div className="w-full h-full relative overflow-hidden">
            {isLocked ? (
              <LockScreen time={time} onUnlock={unlockPhone} />
            ) : currentApp ? (
              <AppRenderer
                appName={currentApp}
                onClose={closeApp}
                onLock={lockPhone}
              />
            ) : (
              <HomeScreen onOpenApp={openApp} />
            )}
          </div>

          {/* Home Indicator / Home Button */}
          {hasHomeButton ? (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-gray-600 bg-black/50 cursor-pointer active:bg-gray-800 flex items-center justify-center"
              onClick={() => {
                if (currentApp) closeApp();
                else if (!isLocked) lockPhone();
              }}
            >
              <div className="w-5 h-5 border border-gray-500 rounded-sm" />
            </div>
          ) : (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full cursor-pointer"
              onClick={() => {
                if (currentApp) closeApp();
                else if (!isLocked) lockPhone();
              }}
            />
          )}

          {/* Side Buttons */}
          <div className="absolute -right-[6px] top-[180px] w-[3px] h-[60px] bg-gray-700 rounded-r" />
          <div className="absolute -left-[6px] top-[150px] w-[3px] h-[30px] bg-gray-700 rounded-l" />
          <div className="absolute -left-[6px] top-[200px] w-[3px] h-[50px] bg-gray-700 rounded-l" />
          <div className="absolute -left-[6px] top-[260px] w-[3px] h-[50px] bg-gray-700 rounded-l" />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
