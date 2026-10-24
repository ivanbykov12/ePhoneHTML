import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import AppRenderer from './components/AppRenderer';
import ControlCenter from './components/ControlCenter';
import { AppContext, SystemSettings, defaultSettings, PhoneModel, EApp } from './context/AppContext';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [islandContent, setIslandContent] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [customApps, setCustomApps] = useState<EApp[]>([]);
  const [showControlCenter, setShowControlCenter] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Обработка закрытия .eapp приложений
  useEffect(() => {
    const handleCloseEApp = () => {
      closeApp();
    };
    window.addEventListener('closeEApp', handleCloseEApp);
    return () => window.removeEventListener('closeEApp', handleCloseEApp);
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
  const getFrameConfig = () => {
    switch (settings.phoneModel) {
      case 'iphone8':
        return {
          width: '375px',
          height: '667px',
          borderRadius: '40px',
          topBezel: '80px', // Большая верхняя рамка
          bottomBezel: '80px', // Большая нижняя рамка
          statusBarHeight: '20px',
          contentPaddingTop: '20px',
        };
      case 'iphonex':
        return {
          width: '375px',
          height: '812px',
          borderRadius: '44px',
          topBezel: '44px',
          bottomBezel: '34px',
          statusBarHeight: '44px',
          contentPaddingTop: '44px',
        };
      case 'iphone14':
        return {
          width: '390px',
          height: '844px',
          borderRadius: '50px',
          topBezel: '50px',
          bottomBezel: '40px',
          statusBarHeight: '54px',
          contentPaddingTop: '54px',
        };
    }
  };

  const frameConfig = getFrameConfig();
  const showIsland = settings.phoneModel === 'iphone14' && !settings.disableIsland;
  const hasNotch = settings.phoneModel === 'iphonex';
  const hasHomeButton = settings.phoneModel === 'iphone8';

  // Responsive scaling for mobile
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const frameH = parseInt(frameConfig.height);
      const frameW = parseInt(frameConfig.width);
      const scaleH = (vh - 40) / frameH;
      const scaleW = (vw - 20) / frameW;
      setScale(Math.min(1, scaleH, scaleW));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [settings.phoneModel]);

  // Загрузка .eapp файлов
  useEffect(() => {
    loadEApps();
    loadSystemApps();
    // Загружаем сохранённые приложения из localStorage
    const saved = localStorage.getItem('customApps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomApps(prev => [...prev, ...parsed.filter((a: EApp) => !prev.find(p => p.id === a.id))]);
        }
      } catch {}
    }
  }, []);

  // Загрузка системных приложений
  const loadSystemApps = async () => {
    const systemApps = [
      'system/snake.eapp',
      'system/tetris.eapp',
      'system/game2048.eapp',
      'system/flappy.eapp',
      'system/calculator.eapp',
      'system/clock.eapp',
      'system/weather.eapp',
      'system/settings.eapp',
      'system/appstore.eapp',
      'system/notes.eapp',
      'system/photos.eapp',
      'system/music.eapp',
      'system/safari.eapp',
      'system/messages.eapp',
      'system/maps.eapp',
      'system/health.eapp'
    ];

    const loaded: EApp[] = [];
    for (const file of systemApps) {
      try {
        const response = await fetch(`/apps/${file}`);
        if (response.ok) {
          const appData = await response.json();
          loaded.push(appData);
        }
      } catch (err) {
        console.warn(`Failed to load system app ${file}:`, err);
      }
    }

    if (loaded.length > 0) {
      setCustomApps(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newApps = loaded.filter(a => !existingIds.has(a.id));
        return [...prev, ...newApps];
      });
    }
  };

  // Сохраняем custom apps в localStorage
  useEffect(() => {
    if (customApps.length > 0) {
      localStorage.setItem('customApps', JSON.stringify(customApps));
    }
  }, [customApps]);

  const loadEApps = async () => {
    try {
      // Загружаем манифест
      const manifestResponse = await fetch('/apps/manifest.json');
      if (!manifestResponse.ok) {
        console.warn('Manifest not found, using defaults');
        // Fallback - загружаем стандартные файлы
        const defaults = [
          'template.eapp', 
          'catch_star.eapp', 
          'reaction_test.eapp',
          'system/snake.eapp',
          'system/tetris.eapp',
          'system/game2048.eapp',
          'system/calculator.eapp',
          'system/clock.eapp',
          'system/weather.eapp'
        ];
        const loaded: EApp[] = [];
        for (const file of defaults) {
          try {
            const res = await fetch(`/apps/${file}`);
            if (res.ok) loaded.push(await res.json());
          } catch {}
        }
        setCustomApps(loaded);
        return;
      }
      
      const manifest = await manifestResponse.json();
      const loadedApps: EApp[] = [];
      
      for (const file of manifest.apps) {
        try {
          const response = await fetch(`/apps/${file}`);
          if (response.ok) {
            const appData = await response.json();
            loadedApps.push(appData);
          }
        } catch (err) {
          console.warn(`Failed to load ${file}:`, err);
        }
      }
      
      setCustomApps(loadedApps);
    } catch (err) {
      console.error('Failed to load eapps:', err);
    }
  };

  return (
    <AppContext.Provider value={{ settings, setSettings, customApps, setCustomApps, showControlCenter, setShowControlCenter }}>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
        {/* ePhone Frame */}
        <div
          className="relative bg-black overflow-hidden"
          style={{
            width: frameConfig.width,
            height: frameConfig.height,
            borderRadius: frameConfig.borderRadius,
            border: '4px solid #333',
            boxShadow: '0 0 0 2px #1a1a1a, 0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #444',
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
          <StatusBar time={time} model={settings.phoneModel} onSwipeDown={() => setShowControlCenter(true)} />

          {/* Control Center */}
          <ControlCenter />

          {/* Main Content Area */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              paddingBottom: hasHomeButton ? frameConfig.bottomBezel : '0px',
            }}
          >
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

          {/* Home Button (iPhone 8) - в нижней рамке */}
          {hasHomeButton && (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-gray-600 bg-black/80 cursor-pointer active:bg-gray-800 flex items-center justify-center"
              style={{ bottom: '18px' }}
              onClick={() => {
                if (currentApp) closeApp();
                else if (!isLocked) lockPhone();
              }}
            >
              <div className="w-5 h-5 border border-gray-500 rounded-sm" />
            </div>
          )}

          {/* Home Indicator (iPhone X, 14) */}
          {!hasHomeButton && (
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
