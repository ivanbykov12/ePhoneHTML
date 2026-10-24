import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import AppRenderer from './components/AppRenderer';
import { AppContext, SystemSettings, defaultSettings } from './context/AppContext';

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

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        {/* iPhone Frame */}
        <div
          className="relative bg-black rounded-[50px] shadow-2xl overflow-hidden"
          style={{
            width: '390px',
            height: '844px',
            border: '4px solid #333',
            boxShadow: '0 0 0 2px #1a1a1a, 0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #444'
          }}
        >
          {/* Dynamic Island */}
          <DynamicIsland content={islandContent} />

          {/* Status Bar */}
          <StatusBar time={time} />

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

          {/* Home Indicator */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full cursor-pointer"
            onClick={() => {
              if (currentApp) closeApp();
              else if (!isLocked) lockPhone();
            }}
          />

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
