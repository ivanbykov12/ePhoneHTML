import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import AppRenderer from './components/AppRenderer';
import ControlCenter from './components/ControlCenter';
import AlwaysOnDisplay from './components/AlwaysOnDisplay';
import { AppContext, SystemSettings, defaultSettings, PhoneModel, EApp } from './context/AppContext';

// Проверка, что запись — валидное приложение, а не случайно сохранённый сырой JSON.
// code обязан быть строкой с HTML-разметкой; массивы/объекты/JSON-дамп туда попадать не должны.
function isValidEApp(app: any): app is EApp {
  if (!app || typeof app !== 'object') return false;
  if (typeof app.id !== 'string' || !app.id) return false;
  if (typeof app.name !== 'string' || !app.name) return false;
  if (typeof app.code !== 'string') return false;
  const trimmed = app.code.trim();
  if (!trimmed) return false;
  // Настоящий код приложения начинается с тега (<div, <script, <!DOCTYPE...)
  if (/^</.test(trimmed)) return true;
  // Если это парсящийся JSON (например, дамп всего массива приложений) — мусор, отклоняем
  if (/^[\[{]/.test(trimmed)) {
    try { JSON.parse(trimmed); return false; } catch {}
  }
  return true; // прочий текст считаем кодом (iframe безопасно экранирует вывод)
}

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [islandContent, setIslandContent] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [customApps, setCustomApps] = useState<EApp[]>([]);
  const [showControlCenter, setShowControlCenter] = useState(false);
  // Экран «выключен»: на телефоне показывается AOD (или полная темнота, если AOD отключён)
  const [screenOff, setScreenOff] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('systemSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setSettings(prev => ({ ...prev, ...defaultSettings, ...parsed }));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAllApps();
  }, []);

  const loadAllApps = async () => {
    // Сначала загружаем системные приложения из файлов (всегда свежие)
    const systemApps = [
      'system/welcome.eapp',
      'system/snake.eapp', 'system/tetris.eapp', 'system/game2048.eapp',
      'system/flappy.eapp', 'system/calculator.eapp', 'system/clock.eapp',
      'system/weather.eapp', 'system/settings.eapp', 'system/appstore.eapp',
      'system/notes.eapp', 'system/photos.eapp', 'system/music.eapp',
      'system/safari.eapp', 'system/messages.eapp', 'system/maps.eapp',
      'system/health.eapp'
    ];
    
    const loadedSystem: EApp[] = [];
    for (const file of systemApps) {
      try {
        const response = await fetch(`/apps/${file}`);
        if (response.ok) loadedSystem.push(await response.json());
      } catch {}
    }

    // Загружаем пользовательские приложения из manifest
    let loadedUser: EApp[] = [];
    try {
      const manifestResponse = await fetch('/apps/manifest.json');
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        for (const file of manifest.apps) {
          if (!file.startsWith('system/')) {
            try {
              const response = await fetch(`/apps/${file}`);
              if (response.ok) {
                const appJson = await response.json();
                if (isValidEApp(appJson)) loadedUser.push(appJson);
              }
            } catch {}
          }
        }
      }
    } catch {}

    // Загружаем пользовательские приложения из localStorage (только не системные)
    const saved = localStorage.getItem('customApps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((app: EApp) => {
            // Пропускаем мусор: записи без обязательных полей или с code,
            // содержащим сырой JSON вместо HTML-кода приложения
            if (!isValidEApp(app)) return;
            if (!app.isSystem && !loadedUser.find(a => a.id === app.id)) {
              loadedUser.push(app);
            }
          });
        }
      } catch {}
    }

    // Объединяем: системные из файлов + пользовательские
    setCustomApps([...loadedSystem, ...loadedUser]);
  };

  useEffect(() => {
    // Сохраняем в localStorage только пользовательские приложения
    const userApps = customApps.filter(app => !app.isSystem);
    if (userApps.length > 0) {
      localStorage.setItem('customApps', JSON.stringify(userApps));
    }
  }, [customApps]);

  useEffect(() => {
    const handleCloseEApp = () => closeApp();
    window.addEventListener('closeEApp', handleCloseEApp);
    return () => window.removeEventListener('closeEApp', handleCloseEApp);
  }, []);

  const openApp = (appName: string) => {
    setCurrentApp(appName);
    setIslandContent(appName);
    setTimeout(() => setIslandContent(null), 3000);
  };

  const closeApp = () => setCurrentApp(null);
  const lockPhone = () => { setIsLocked(true); setCurrentApp(null); };
  const unlockPhone = () => setIsLocked(false);



  const getFrameConfig = () => {
    switch (settings.phoneModel) {
      case 'iphone8':
        return { width: '375px', height: '667px', borderRadius: '10px', topBezel: '20px', bottomBezel: '80px' };
      case 'iphonex':
        return { width: '375px', height: '812px', borderRadius: '44px', topBezel: '44px', bottomBezel: '34px' };
      case 'iphone14':
        return { width: '390px', height: '844px', borderRadius: '50px', topBezel: '50px', bottomBezel: '40px' };
      case 'epad101':
        return { width: '1080px', height: '810px', borderRadius: '30px', topBezel: '25px', bottomBezel: '20px' };
    }
  };

  const frameConfig = getFrameConfig();
  const showIsland = (settings.phoneModel === 'iphone14' || settings.phoneModel === 'epad101') && !settings.disableIsland;
  const hasNotch = settings.phoneModel === 'iphonex';
  const hasHomeButton = settings.phoneModel === 'iphone8';
  const isPad = settings.phoneModel === 'epad101';

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const updateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const frameH = parseInt(frameConfig.height);
      const frameW = parseInt(frameConfig.width);
      setScale(Math.min(1, (vh - 40) / frameH, (vw - 20) / frameW));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [settings.phoneModel]);

  const getWallpaperGradient = () => {
    const wallpapers: Record<string, string> = {
      gradient1: 'from-indigo-900 via-purple-800 to-black',
      gradient2: 'from-rose-900 via-orange-800 to-amber-900',
      gradient3: 'from-emerald-900 via-teal-800 to-cyan-900',
      gradient4: 'from-violet-900 via-fuchsia-800 to-pink-900',
      dark: 'from-gray-900 to-black',
      light: 'from-blue-200 via-purple-200 to-pink-200',
    };
    return wallpapers[settings.wallpaper] || wallpapers.gradient1;
  };

  return (
    <AppContext.Provider value={{ settings, setSettings, customApps, setCustomApps, showControlCenter, setShowControlCenter }}>
      <div className="w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 100%)' }}>
        
        {/* Phone Frame + обёртка с кнопкой питания справа */}
        <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <div className="relative bg-black overflow-hidden phone-shadow"
          style={{
            width: frameConfig.width,
            height: frameConfig.height,
            borderRadius: frameConfig.borderRadius,
          }}>
          
          {/* Dynamic Island */}
          {showIsland && !screenOff && <DynamicIsland content={islandContent} />}

          {/* Notch */}
          {hasNotch && !screenOff && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-[20px] z-50" />
          )}

          {/* Status Bar */}
          {!screenOff && <StatusBar time={time} model={settings.phoneModel} onSwipeDown={() => setShowControlCenter(true)} />}

          {/* Control Center */}
          {!screenOff && <ControlCenter bottomInset={hasHomeButton ? parseInt(frameConfig.bottomBezel) : 0} />}

          {/* Content */}
          {screenOff ? (
            settings.aodEnabled ? (
              /* Тап по AOD — экран включается И перекидывает на экран блокировки */
              <AlwaysOnDisplay time={time} bottomInset={hasHomeButton ? parseInt(frameConfig.bottomBezel) : 0} onTapWake={() => { setScreenOff(false); setIsLocked(true); setCurrentApp(null); }} />
            ) : (
              /* AOD выключен — полностью тёмный экран, тап включает его обратно */
              <div className="absolute inset-0 z-[60] bg-black cursor-pointer" onClick={() => setScreenOff(false)} />
            )
          ) : !settings.welcomeCompleted ? (
            /* Welcome Setup - Full Screen */
            <div className="w-full h-full relative overflow-hidden">
              <AppRenderer appName="welcome_setup" onClose={() => {}} onLock={() => {}} />
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden"
              style={{
                paddingTop: hasHomeButton ? frameConfig.topBezel : '0px',
                paddingBottom: hasHomeButton ? frameConfig.bottomBezel : '0px',
              }}>
              {isLocked ? (
                <LockScreen time={time} onUnlock={unlockPhone} />
              ) : currentApp ? (
                <AppRenderer appName={currentApp} onClose={closeApp} onLock={lockPhone} />
              ) : (
                <HomeScreen onOpenApp={openApp} />
              )}
            </div>
          )}

          {/* Home Button (iPhone 8) */}
          {hasHomeButton && !screenOff && (
            <div className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-gray-600/50 bg-black/50 cursor-pointer active:bg-gray-800/50 flex items-center justify-center backdrop-blur-sm transition-all"
              style={{ bottom: '18px' }}
              onClick={() => { if (currentApp) closeApp(); else if (!isLocked) lockPhone(); }}>
              <div className="w-5 h-5 border border-gray-500/50 rounded-[5px]" />
            </div>
          )}

          {/* Home Indicator */}
          {!hasHomeButton && !screenOff && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full cursor-pointer active:bg-white/60 transition-colors"
              onClick={() => { if (currentApp) closeApp(); else if (!isLocked) lockPhone(); }} />
          )}

          {/* Side Buttons (громкость слева — внутри корпуса) */}
          <div className="absolute -left-[5px] top-[150px] w-[3px] h-[28px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
          <div className="absolute -left-[5px] top-[200px] w-[3px] h-[45px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
          <div className="absolute -left-[5px] top-[260px] w-[3px] h-[45px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
        </div>

        {/* Кнопка питания — крупная видимая кнопка СПРАВА ОТ корпуса (вне overflow-hidden, всегда видима).
            Нажатие выключает экран (AOD) / включает его обратно. */}
        <button type="button"
          title={screenOff ? 'Включить экран' : 'Выключить экран (AOD)'}
          onClick={() => setScreenOff(v => !v)}
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1
            cursor-pointer select-none transition-all duration-150 border-none rounded-xl
            hover:brightness-125 active:scale-95"
          style={{
            left: `calc(100% + 8px)`,
            width: '44px',
            height: '110px',
            background: screenOff
              ? 'linear-gradient(to bottom, #ff9d3c, #e07000)'
              : 'linear-gradient(to bottom, #4b5563, #1f2937)',
            boxShadow: screenOff
              ? '0 0 18px rgba(255,140,0,0.75), inset 0 1px 3px rgba(255,255,255,0.4)'
              : '0 4px 14px rgba(0,0,0,0.7), inset 0 1px 3px rgba(255,255,255,0.3)',
          }}>
          {/* Иконка питания ⏻ */}
          <span className="pointer-events-none select-none"
            style={{ fontSize: '20px', lineHeight: 1, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>⏻</span>
          {/* Подпись состояния прямо на кнопке */}
          <span className="pointer-events-none select-none font-semibold"
            style={{ fontSize: '9px', lineHeight: 1, color: 'rgba(255,255,255,0.85)' }}>
            {screenOff ? 'ВКЛ' : 'ВЫКЛ'}
          </span>
        </button>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
