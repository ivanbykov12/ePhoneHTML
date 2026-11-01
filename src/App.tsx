import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import AppRenderer from './components/AppRenderer';
import ControlCenter from './components/ControlCenter';
import AlwaysOnDisplay from './components/AlwaysOnDisplay';
import NotificationCenter, { SimNotification } from './components/NotificationCenter';
import NotificationBanner from './components/NotificationBanner';
import AssistantView from './components/AssistantView';
import DuoDevice from './components/DuoDevice';
import { AppContext, SystemSettings, defaultSettings, PhoneModel, EApp, DuoState, DUO_SIZES } from './context/AppContext';

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
  // Уведомления в реальном времени
  const [notifications, setNotifications] = useState<SimNotification[]>([]);
  const [banner, setBanner] = useState<SimNotification | null>(null);
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  // eSiri-подобный ассистент
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');
  // Анимация перехода между приложениями
  const [appClosing, setAppClosing] = useState(false);
  const notifSeq = React.useRef(1);

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

  const pushNotification = (appId: string, title: string, body: string) => {
    if (!settings.notifications) return;
    const n: SimNotification = { id: notifSeq.current++, appId, title, body, time: Date.now() };
    setNotifications(prev => [...prev.slice(-19), n]);
    setBanner(n);
    setTimeout(() => setBanner(b => (b && b.id === n.id ? null : b)), 5000);
  };

  // «Интеграция с реальными API»: периодическая погода из Open-Meteo (без ключа)
  useEffect(() => {
    let alive = true;
    const fetchWeather = async () => {
      try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m,weather_code&timezone=auto');
        if (!r.ok || !alive) return;
        const d = await r.json();
        const t = Math.round(d?.current?.temperature_2m ?? 0);
        const wcodes: Record<number, string> = { 0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность', 3: 'Пасмурно' };
        const desc = wcodes[d?.current?.weather_code] ?? 'Облачно';
        if (alive) pushNotification('weather_system', 'Погода · Open-Meteo', `${desc}, ${t}°C в Москве`);
      } catch {}
    };
    const first = setTimeout(fetchWeather, 8000);
    const timer = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => { alive = false; clearTimeout(first); clearInterval(timer); };
  }, [settings.notifications]);

  // Системные уведомления-подсказки (реальное время, без интернета)
  useEffect(() => {
    const tips: Array<[string, string]> = [
      ['notes_system', 'Заметки: не забудьте заглянуть в App Store — там новинки!'],
      ['clock_system', 'Напоминание: пора сделать перерыв от экрана 🙂'],
      ['health_system', 'eHealth: самое время пройтись — 10 минут активности.'],
    ];
    let i = 0;
    const timer = setInterval(() => {
      const [appId, text] = tips[i % tips.length];
      pushNotification(appId, 'ePhone', text);
      i++;
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [settings.notifications]);

  const loadAllApps = async () => {
    // Сначала загружаем системные приложения из файлов (всегда свежие)
    const systemApps = [
      'system/welcome.eapp',
      'system/snake.eapp', 'system/tetris.eapp', 'system/game2048.eapp',
      'system/flappy.eapp', 'system/breakout.eapp', 'system/memory.eapp',
      'system/calculator.eapp', 'system/clock.eapp',
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
    const handleOpenAssistant = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query?: string } | undefined;
      setAssistantQuery(detail?.query || '');
      setIsLocked(false);
      setShowAssistant(true);
    };
    window.addEventListener('closeEApp', handleCloseEApp);
    window.addEventListener('openAssistant', handleOpenAssistant);
    return () => {
      window.removeEventListener('closeEApp', handleCloseEApp);
      window.removeEventListener('openAssistant', handleOpenAssistant);
    };
  }, []);

  const openApp = (appName: string) => {
    setAppClosing(false);
    setCurrentApp(appName);
    setIslandContent(appName);
    setTimeout(() => setIslandContent(null), 3000);
  };

  const closeApp = () => {
    // анимация «схлопывания» приложения перед возвратом на рабочий стол
    setAppClosing(true);
    setTimeout(() => { setCurrentApp(null); setAppClosing(false); }, 260);
  };
  const lockPhone = () => { setIsLocked(true); setCurrentApp(null); setShowNotifCenter(false); };
  const unlockPhone = () => setIsLocked(false);



  const handleAssistantCommand = (raw: string): string => {
    const cmd = raw.toLowerCase().trim();
    const findApp = (kw: string[]) => customApps.find(a => kw.some(k => a.name.toLowerCase().includes(k) || a.id.includes(k)));
    if (/привет|здравств|хай/.test(cmd)) return 'Привет! Я eSiri. Могу открыть приложение, сменить обои или ответить на вопрос.';
    if (/что ты|умеешь|команд/.test(cmd)) return 'Команды: «Открой Погоду», «Тёмная тема», «Светлая тема», «Время», «Дата», «Батарея», «AOD вкл/выкл».';
    if (/врем|котор час|сколько времени/.test(cmd)) return `Сейчас ${time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}.`;
    if (/дат|какой день|число/.test(cmd)) return `Сегодня ${time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`;
    if (/батар|заряд|энерги/.test(cmd)) return 'Заряд батареи: 87%, хватит ещё надолго 🔋';
    if (/погод/.test(cmd)) { const w = findApp(['погод', 'weather']); if (w) { setTimeout(() => { setShowAssistant(false); setIsLocked(false); openApp(w.id); }, 500); return 'Открываю погоду…'; } return 'Приложение «Погода» не найдено.'; }
    if (/тёмн|темн|dark/.test(cmd)) { setSettings(s => ({ ...s, darkMode: true })); return 'Включаю тёмную тему 🌙'; }
    if (/светл|light/.test(cmd)) { setSettings(s => ({ ...s, darkMode: false })); return 'Тема стала светлой ☀️'; }
    if (/aod.*вкл|aod.*выкл|включи aod|выключи aod/.test(cmd)) {
      const enable = /вкл/.test(cmd) && !/выкл/.test(cmd);
      setSettings(s => ({ ...s, aodEnabled: enable }));
      return enable ? 'AOD включён — часы будут видны при выключенном экране.' : 'AOD выключен.';
    }
    if (/открой|запусти|приложени|launch|open/.test(cmd)) {
      const cleaned = cmd.replace(/открой|запусти|приложение|запуски?|e?siri|пожалуйста|[.,!?]/g, '').trim();
      const target = cleaned ? customApps.find(a => a.name.toLowerCase().includes(cleaned) || (a.name.toLowerCase() && cleaned && a.name.toLowerCase().split(' ').some(w => w.length > 3 && cleaned.includes(w)))) : undefined;
      if (target) {
        setTimeout(() => { setShowAssistant(false); setIsLocked(false); openApp(target.id); }, 600);
        return `Открываю «${target.name}»…`;
      }
      return 'Не нашёл такое приложение. Попробуйте: «Открой Погода», «Открой Заметки», «Открой Калькулятор».';
    }
    return 'Хм, не совсем понял. Спросите: «Какое время?» или «Открой Калькулятор».';
  };

  // ===== ePhone Duo: состояния раскрытия =====
  const [duoState, setDuoState] = useState<DuoState>('closed');

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
      case 'ephoneduo': {
        const s = DUO_SIZES[duoState];
        return { width: `${s.width}px`, height: `${s.height}px`, borderRadius: duoState === 'closed' ? '36px' : '44px', topBezel: '0px', bottomBezel: '0px' };
      }
    }
  };

  const frameConfig = getFrameConfig();
  const showIsland = (settings.phoneModel === 'iphone14' || settings.phoneModel === 'epad101') && !settings.disableIsland;
  const hasNotch = settings.phoneModel === 'iphonex';
  const hasHomeButton = settings.phoneModel === 'iphone8';
  const isPad = settings.phoneModel === 'epad101';
  const isDuo = settings.phoneModel === 'ephoneduo';
  const duoOpen = isDuo && duoState !== 'closed';

  const cycleDuoState = () => {
    if (!isDuo) return;
    setDuoState(prev => (prev === 'closed' ? 'half-open' : prev === 'half-open' ? 'open' : 'closed'));
  };

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const updateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // Для Duo считаем масштаб по МАКСИМАЛЬНОЙ (раскрытой) ширине корпуса,
      // чтобы при анимации раскрытия устройство не выходило за пределы окна
      const maxW = isDuo ? Math.max(...Object.values(DUO_SIZES).map(s => s.width)) : parseInt(frameConfig.width);
      const frameH = parseInt(frameConfig.height);
      setScale(Math.min(1, (vh - 40) / frameH, (vw - 20) / maxW));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [settings.phoneModel, duoState]);

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

  const screenContent = (
    <>
          {/* Dynamic Island */}
          {showIsland && !screenOff && <DynamicIsland content={islandContent} />}

          {/* Notch */}
          {hasNotch && !screenOff && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-[20px] z-50" />
          )}

          {/* Status Bar: на Duo в открытом режиме дублируется на каждом «экране» */}
          {!screenOff && !(isDuo && duoOpen) && (
            <StatusBar time={time} model={settings.phoneModel} onSwipeDown={() => setShowControlCenter(true)} />
          )}
          {!screenOff && isDuo && duoOpen && (() => {
            const halfW = Math.round((parseInt(frameConfig.width) - (duoState === 'open' ? 24 : 0)) / 2);
            return (
              <>
                <div className="absolute top-0 left-0 overflow-hidden z-40 pointer-events-none" style={{ width: `${halfW}px`, height: '60px' }}>
                  <div style={{ width: frameConfig.width, pointerEvents: 'auto' }}>
                    <StatusBar time={time} model={settings.phoneModel} onSwipeDown={() => setShowControlCenter(true)} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 overflow-hidden z-40 pointer-events-none" style={{ width: `${halfW}px`, height: '60px' }}>
                  <div style={{ width: frameConfig.width, position: 'absolute', right: 0, pointerEvents: 'auto' }}>
                    <StatusBar time={time} model={settings.phoneModel} onSwipeDown={() => setShowControlCenter(true)} />
                  </div>
                </div>
              </>
            );
          })()}

          {/* Control Center — на iPhone 8 нижняя рамка (home-кнопка) остаётся свободной:
              панель занимает только область экрана (topBezel..bottomBezel) */}
          {!screenOff && (
            <div className="absolute" style={{ top: hasHomeButton ? frameConfig.topBezel : 0, left: 0, right: 0, bottom: hasHomeButton ? frameConfig.bottomBezel : 0 }}>
              <ControlCenter />
            </div>
          )}

          {/* Content */}
          {screenOff ? (
            settings.aodEnabled ? (
              /* Тап по AOD — экран включается И перекидывает на экран блокировки */
              <AlwaysOnDisplay time={time} notificationCount={notifications.length}
                onTapWake={() => { setScreenOff(false); setIsLocked(true); setCurrentApp(null); }}
                onSwipeDownToLock={() => { setScreenOff(false); setIsLocked(true); setCurrentApp(null); setShowNotifCenter(true); }} />
            ) : (
              /* AOD выключен — полностью тёмный экран, тап включает его обратно.
                 Обрезан по нижнюю рамку (iPhone 8), чтобы не перекрывать home-кнопку */
              <div className="absolute z-[60] bg-black cursor-pointer" style={{ top: 0, left: 0, right: 0, bottom: hasHomeButton ? frameConfig.bottomBezel : 0 }} onClick={() => setScreenOff(false)} />
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
                <LockScreen time={time} onUnlock={unlockPhone}
                  notificationCount={notifications.length}
                  onOpenNotifications={() => setShowNotifCenter(true)} />
              ) : currentApp ? (
                <div className={`w-full h-full ${appClosing ? 'animate-app-close' : 'animate-app-open'}`}>
                  <AppRenderer appName={currentApp} onClose={closeApp} onLock={lockPhone} />
                </div>
              ) : (
                <HomeScreen onOpenApp={openApp} />
              )}
            </div>
          )}

          {/* Home Button (iPhone 8) — рисуется ПОСЛЕ ControlCenter (z-[100]) и AOD,
              поэтому всегда виден поверх них; клики по самой кнопке не перехватываются */}
          {hasHomeButton && (
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

          {/* Баннер уведомления в реальном времени (показывается поверх всего, кроме выключенного экрана) */}
          {!screenOff && banner && !showNotifCenter && (
            <NotificationBanner notification={banner}
              onTap={() => { setBanner(null); setShowNotifCenter(true); }} />
          )}

          {/* Центр уведомлений */}
          {!screenOff && showNotifCenter && (
            <NotificationCenter
              notifications={notifications}
              onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
              onClose={() => setShowNotifCenter(false)}
              onOpenApp={(appId) => {
                if (customApps.some(a => a.id === appId)) {
                  setShowNotifCenter(false); setIsLocked(false); openApp(appId);
                }
              }}
            />
          )}

          {/* eSiri-подобный ассистент — на iPhone 8 обрезан по нижнюю рамку,
              чтобы не перекрывать кнопку Home и нижнюю рамку корпуса */}
          {!screenOff && showAssistant && (
            <div className="absolute z-[130]" style={{ top: 0, left: 0, right: 0, bottom: hasHomeButton ? frameConfig.bottomBezel : 0 }}>
              <AssistantView
                onClose={() => { setShowAssistant(false); setAssistantQuery(''); }}
                initialQuery={assistantQuery}
                onCommand={(cmd) => handleAssistantCommand(cmd)}
              />
            </div>
          )}

          {/* Side Buttons (громкость слева — внутри корпуса) */}
          <div className="absolute -left-[5px] top-[150px] w-[3px] h-[28px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
          <div className="absolute -left-[5px] top-[200px] w-[3px] h-[45px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
          <div className="absolute -left-[5px] top-[260px] w-[3px] h-[45px] bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-sm" />
    </>
  );

  return (
    <AppContext.Provider value={{ settings, setSettings, customApps, setCustomApps, showControlCenter, setShowControlCenter, duoState, isDuoOpen: duoOpen }}>
      <div className="w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 100%)' }}>

        {/* Phone Frame + обёртка с кнопкой питания справа */}
        <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        {isDuo ? (
          /* ePhone Duo — раскладной корпус с анимацией ширины и шарниром */
          <DuoDevice duoState={duoState}>
            {screenContent}
          </DuoDevice>
        ) : (
        <div className="relative bg-black overflow-hidden phone-shadow"
          style={{
            width: frameConfig.width,
            height: frameConfig.height,
            borderRadius: frameConfig.borderRadius,
          }}>
          {screenContent}
        </div>
        )}

        {/* Кнопка «Раскрыть / Сложить» — только для ePhone Duo, под кнопкой питания.
            Цикл: closed → half-open → open → closed (плавная CSS-анимация ширины в DuoDevice) */}
        {isDuo && (
          <button type="button"
            title={`ePhone Duo: ${duoState === 'closed' ? 'раскрыть до угла' : duoState === 'half-open' ? 'раскрыть полностью' : 'сложить'}`}
            onClick={cycleDuoState}
            className="absolute flex flex-col items-center justify-center gap-1 cursor-pointer select-none
              border-none rounded-xl hover:brightness-125 active:scale-95 transition-all duration-150"
            style={{
              left: 'calc(100% + 8px)',
              top: 'calc(50% + 76px)',
              width: '44px',
              height: '96px',
              background: duoState === 'open'
                ? 'linear-gradient(to bottom, #3b82f6, #1d4ed8)'
                : duoState === 'half-open'
                  ? 'linear-gradient(to bottom, #8b5cf6, #5b21b6)'
                  : 'linear-gradient(to bottom, #4b5563, #1f2937)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.7), inset 0 1px 3px rgba(255,255,255,0.3)',
            }}>
            {/* Иконка книги/двух экранов */}
            <svg className="w-5 h-5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5V19M12 6.5C10.5 5 8 4.5 4 5v13c4-.5 6.5 0 8 1.5M12 6.5C13.5 5 16 4.5 20 5v13c-4-.5-6.5 0-8 1.5" />
            </svg>
            <span className="pointer-events-none select-none font-semibold"
              style={{ fontSize: '8px', lineHeight: 1.1, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
              {duoState === 'closed' ? 'РАСКРЫТЬ' : duoState === 'half-open' ? 'ДО КОНЦА' : 'СЛОЖИТЬ'}
            </span>
          </button>
        )}

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
