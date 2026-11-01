import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, getStatusBarPadding, getDockBottomInset, EApp, getEAppVersion } from '../context/AppContext';
import { FolderOpen, Upload, Download, Trash2, Move, Home, ArrowLeft } from 'lucide-react';

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp }) => {
  const { settings, customApps, setCustomApps } = useAppContext();
  const paddingTop = getStatusBarPadding(settings.phoneModel);
  const bottomSafe = getDockBottomInset(settings.phoneModel);
  const [showCustomApps, setShowCustomApps] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [desktopApps, setDesktopApps] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('desktopApps');
    if (saved) { try { setDesktopApps(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => { localStorage.setItem('desktopApps', JSON.stringify(desktopApps)); }, [desktopApps]);

  // ===== Виджеты на рабочем столе =====
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const [widgetWeather, setWidgetWeather] = useState<{ temp: number; desc: string } | null>(null);
  // Поиск через eSiri: строка поиска в виджете отправляет запрос ассистенту
  const [siriQuery, setSiriQuery] = useState('');
  const openSiriSearch = (q: string) => {
    window.dispatchEvent(new CustomEvent('openAssistant', { detail: { query: q.trim() } }));
  };
  useEffect(() => {
    let alive = true;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m,weather_code&timezone=auto')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (!alive) return;
        const codes: Record<number, string> = { 0: 'Ясно ☀️', 1: 'Ясно 🌤️', 2: 'Облачно ⛅', 3: 'Пасмурно ☁️' };
        setWidgetWeather({ temp: Math.round(d?.current?.temperature_2m ?? 0), desc: codes[d?.current?.weather_code] ?? 'Облачно 🌥️' });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // ===== Жесты: свайп между страницами + pinch-to-zoom =====
  const [page, setPage] = useState(0); // 0 | 1
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const touchStart = useRef<{ x: number; y: number; dist: number } | null>(null);
  const wheelTimer = useRef<any>(null);

  const clampZoom = (z: number) => Math.min(1.4, Math.max(0.7, z));
  const applyZoom = (z: number) => { zoomRef.current = clampZoom(z); setZoom(zoomRef.current); };

  const getDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) touchStart.current = { x: 0, y: 0, dist: getDist(e.touches) };
    else if (e.touches.length === 1) touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    if (e.touches.length === 2 && touchStart.current.dist > 0) {
      const d = getDist(e.touches);
      applyZoom(zoomRef.current * (d / touchStart.current.dist));
      touchStart.current.dist = d;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touchStart.current; touchStart.current = null;
    if (!st || st.dist > 0) return; // был пинч
    const t = e.changedTouches[0];
    const dx = t.clientX - st.x, dy = t.clientY - st.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) setPage(p => (dx < 0 ? Math.min(1, p + 1) : Math.max(0, p - 1)));
  };
  // зум колесом с зажатым Ctrl — как на десктопе
  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    applyZoom(zoomRef.current - e.deltaY * 0.004);
    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {}, 100);
  };

  const systemEApps = customApps.filter(app => app.isSystem);
  const userEApps = customApps.filter(app => !app.isSystem);
  const desktopEApps = userEApps.filter(app => desktopApps.includes(app.id));
  const folderEApps = userEApps.filter(app => !desktopApps.includes(app.id));
  const isPad = settings.phoneModel === 'epad101';
  // Сетка рабочего стола: на ePad колонки считаются по фиксированной ширине ячейки (96px),
  // поэтому иконки и виджеты не растягиваются на всю ширину планшета.
  const GRID_COLS = isPad ? 'repeat(auto-fill, minmax(96px, 1fr))'
    : 'repeat(4, minmax(0, 1fr))';
  const WIDGET_GRID = isPad ? 'repeat(auto-fill, minmax(150px, 1fr))'
    : 'repeat(4, minmax(0, 1fr))';
  const SPAN_2X2 = isPad ? 2 : 2;   // погода 2×2 (в колонках сетки иконок)
  const SPAN_1X4 = isPad ? 4 : 4;   // eSiri+поиск 1×4 (во всю ширину)
  const PER_PAGE = isPad ? 24 : 8;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const appData = JSON.parse(text);
      if (!appData.id || !appData.name || !appData.code) { alert('Неверный формат .eapp!'); return; }
      // Защита от «шума»: code обязан быть HTML-разметкой, а не строкой с сырым JSON
      // (например, случайно экспортированным дампом всего массива приложений).
      const codeStr = String(appData.code).trim();
      if (!/^</.test(codeStr) && /^[[{]/.test(codeStr)) {
        try { JSON.parse(codeStr); alert('В файле .eapp вместо кода приложения лежит сырой JSON. Импорт отменён.'); return; } catch {}
      }
      setCustomApps(prev => [...prev.filter(a => a.id !== appData.id), appData]);
      setShowUpload(false);
    } catch { alert('Ошибка чтения файла'); }
  };

  const handleDeleteApp = (app: EApp) => {
    if (confirm(`Удалить "${app.name}"?`)) {
      setCustomApps(prev => prev.filter(a => a.id !== app.id));
      setDesktopApps(prev => prev.filter(id => id !== app.id));
    }
  };

  const handleDownloadApp = (app: EApp) => {
    const blob = new Blob([JSON.stringify(app, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${app.id}.eapp`; a.click();
    URL.revokeObjectURL(url);
  };

  const renderAppIcon = (app: EApp, size: 'large' | 'small' = 'large') => {
    const isMaterial = app.icon?.startsWith('material:');
    const iconContent = isMaterial ? app.icon.replace('material:', '') : (app.icon || '📱');
    const eappVersion = getEAppVersion(app);
    const sizeClass = size === 'large' ? (isPad ? 'w-16 h-16' : 'w-14 h-14') : 'w-12 h-12';
    const iconSize = size === 'large' ? (isPad ? 'text-3xl' : 'text-2xl') : 'text-xl';

    return (
      <div className={`${sizeClass} rounded-[14px] bg-gradient-to-br ${app.color || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
        {isMaterial ? (
          <span className={`material-icons text-white ${iconSize}`}>{iconContent}</span>
        ) : (
          <span className={iconSize}>{iconContent}</span>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 px-1 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[7px] text-white font-bold border border-white/10">
          v{eappVersion}
        </div>
      </div>
    );
  };

  const getWallpaper = () => {
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

  if (showCustomApps) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-gray-900 to-black flex flex-col animate-slide-up`} style={{ paddingTop }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => setShowCustomApps(false)} className="text-blue-400 text-sm flex items-center gap-1 active:opacity-70">
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
          <h1 className="text-white text-lg font-bold">Custom Apps</h1>
          <button onClick={() => setShowUpload(true)} className="text-blue-400 active:opacity-70">
            <Upload className="w-5 h-5" />
          </button>
        </div>

        {showUpload && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-xs border border-white/10">
              <h3 className="text-white text-lg font-bold mb-4">Загрузить .eapp</h3>
              <p className="text-gray-400 text-sm mb-4">Выберите .eapp файл</p>
              <label className="block w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white text-center font-bold cursor-pointer active:scale-95 transition-transform shadow-lg">
                Выбрать файл
                <input type="file" accept=".eapp,.json" onChange={handleFileUpload} className="hidden" />
              </label>
              <button onClick={() => setShowUpload(false)} className="w-full mt-3 py-2 text-gray-400 text-sm active:opacity-70">Отмена</button>
            </div>
          </div>
        )}

        <div className="flex-1 px-4 overflow-y-auto">
          {desktopEApps.length > 0 && (
            <div className="mb-4">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Home className="w-3 h-3" /> На рабочем столе
              </div>
              <div className="space-y-2">
                {desktopEApps.map(app => (
                  <div key={app.id} className="bg-gray-800/50 border border-green-500/20 rounded-2xl p-3 flex items-center gap-3 animate-fade-in">
                    <div className="cursor-pointer flex-shrink-0 active:scale-90 transition-transform" onClick={() => onOpenApp(app.id)}>
                      {renderAppIcon(app, 'small')}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenApp(app.id)}>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{app.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${getEAppVersion(app) === '1.1' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/40 text-gray-400'}`}>
                          eApp v{getEAppVersion(app)}
                        </span>
                      </div>
                      <div className="text-green-400/70 text-xs">На рабочем столе</div>
                    </div>
                    <button onClick={() => setDesktopApps(prev => prev.filter(id => id !== app.id))}
                      className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center active:bg-gray-600">
                      <FolderOpen className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
              <FolderOpen className="w-3 h-3" /> В папке
            </div>
            {folderEApps.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-xs">Добавьте .eapp файлы через кнопку ↑</p>
              </div>
            ) : (
              <div className="space-y-2">
                {folderEApps.map(app => (
                  <div key={app.id} className="bg-gray-800 rounded-2xl p-3 flex items-center gap-3 animate-fade-in">
                    <div className="cursor-pointer flex-shrink-0 active:scale-90 transition-transform" onClick={() => onOpenApp(app.id)}>
                      {renderAppIcon(app, 'small')}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenApp(app.id)}>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{app.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${getEAppVersion(app) === '1.1' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/40 text-gray-400'}`}>
                          eApp v{getEAppVersion(app)}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs truncate">{app.description || app.author || 'Custom App'}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setDesktopApps(prev => [...prev, app.id])}
                        className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center active:bg-gray-600">
                        <Move className="w-4 h-4 text-green-400" />
                      </button>
                      <button onClick={() => handleDownloadApp(app)}
                        className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center active:bg-gray-600">
                        <Download className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => handleDeleteApp(app)}
                        className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center active:bg-gray-600">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-b ${getWallpaper()} flex flex-col`} style={{ paddingTop }}>
      <div className="flex-1 px-5 pt-4 overflow-y-auto" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={onWheel}>
        {/* Строка поиска объединена с eSiri в один виджет 1×4 */}
        <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: WIDGET_GRID, gridAutoRows: 'minmax(64px, auto)', gap: '12px' }}>
          {/* eSiri + Поиск — виджет 1×4 (во всю ширину) */}
          <div className="glass rounded-3xl relative overflow-hidden flex items-center gap-3 px-4"
            style={{ gridColumn: `span ${SPAN_1X4}`, minHeight: '64px' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(59,130,246,0.15))' }} />
            <button onClick={() => window.dispatchEvent(new Event('openAssistant'))}
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg active:scale-90 transition-transform relative z-10"
              style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)' }} title="eSiri — ассистент">
              <span className="text-white text-lg">🎙️</span>
            </button>
            <form className="flex-1 relative z-10 min-w-0" onSubmit={e => { e.preventDefault(); openSiriSearch(siriQuery); }}>
              <input
                value={siriQuery}
                onChange={e => setSiriQuery(e.target.value)}
                placeholder="Поиск через eSiri…"
                className="w-full bg-white/10 rounded-full px-4 py-2 text-white text-xs placeholder-white/40 outline-none focus:bg-white/15 transition-colors"
              />
            </form>
            <button onClick={() => openSiriSearch(siriQuery)}
              className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>
          </div>

          {/* Часы — 1×2 (две ячейки сетки иконок по высоте) */}
          <div className="glass rounded-3xl p-3.5 relative overflow-hidden" style={{ gridColumn: `span 1`, gridRow: `span ${isPad ? 2 : 1}` }}>
            <div className="text-white text-[26px] font-extralight tracking-tight leading-none">
              {now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-white/50 text-[10px] mt-1 capitalize">{now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>

          {/* Погода — виджет 2×2 (реальный API Open-Meteo) */}
          <div className="glass rounded-3xl p-3.5 relative overflow-hidden" style={{ gridColumn: `span ${SPAN_2X2}`, gridRow: `span ${isPad ? 2 : 1}` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/25 to-indigo-500/15 pointer-events-none" />
            {widgetWeather ? (
              <>
                <div className="text-white text-[26px] font-extralight leading-none">{widgetWeather.temp}°</div>
                <div className="text-white/60 text-[10px] mt-1">{widgetWeather.desc} · Москва</div>
              </>
            ) : (
              <>
                <div className="text-white/50 text-[26px] font-extralight leading-none animate-pulse">--°</div>
                <div className="text-white/40 text-[10px] mt-1">Загрузка погоды…</div>
              </>
            )}
          </div>
        </div>

        <div className="gap-y-5 gap-x-4"
          style={{ display: 'grid', gridTemplateColumns: GRID_COLS, transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}>
          {[...systemEApps, ...desktopEApps, { id: '__folder__', name: 'Custom Apps' } as any]
            .slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
            .map((app: any, i) => {
              if (app.id === '__folder__') {
                return (
                  <div key={app.id} className="flex flex-col items-center app-icon cursor-pointer" onClick={() => setShowCustomApps(true)}>
                    <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <FolderOpen className="w-7 h-7 text-white relative z-10" strokeWidth={1.8} />
                      {folderEApps.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                          <span className="text-white text-[9px] font-bold">{folderEApps.length}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white text-[10px] mt-1 text-center leading-tight truncate w-16 drop-shadow">Custom Apps</span>
                  </div>
                );
              }
              return (
                <div key={app.id} className="flex flex-col items-center app-icon cursor-pointer relative" onClick={() => onOpenApp(app.id)}
                  style={{ animationDelay: `${i * 0.03}s` }}>
                  {renderAppIcon(app)}
                  {app.isSystem && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                      <span className="text-white text-[8px] font-bold">S</span>
                    </div>
                  )}
                  <span className="text-white text-[10px] mt-1 text-center leading-tight truncate w-16 drop-shadow">{app.name}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex justify-center gap-1 mb-2">
        {[0, 1].map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${p === page ? 'bg-white shadow-lg' : 'bg-white/40'}`} />
        ))}
      </div>

      {/* Док-панель: приподнята над нижним краем на величину нижней safe area модели + зазор */}
      <div
        className="mx-4 px-4 py-3 glass rounded-[22px]"
        style={{ marginBottom: bottomSafe + (isPad ? 12 : 8) }}
      >
        <div className={`flex ${isPad ? 'justify-between' : 'justify-around'}`}>
          {(isPad ?
            ['safari_system', 'messages_system', 'music_system', 'appstore_system', 'photos_system', 'notes_system', 'calculator_system', 'clock_system'] :
            ['safari_system', 'messages_system', 'music_system', 'appstore_system']
          ).map(appId => {
            const app = systemEApps.find(a => a.id === appId);
            if (!app) return null;
            return (
              <div key={app.id} className="app-icon cursor-pointer" onClick={() => onOpenApp(app.id)}>
                {renderAppIcon(app)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
