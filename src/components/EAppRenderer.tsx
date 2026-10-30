import React, { useEffect, useRef, useState } from 'react';
import { EApp, useAppContext, PhoneModel, getEAppVersion } from '../context/AppContext';

interface EAppRendererProps {
  app: EApp;
}

// Нормализация кода приложения: защита от двойного JSON-кодирования и «сырого» вывода.
// Если поле code содержит сериализованный JSON (обёрнутая строка "{\"html...\"}"
// или объект вида {"id":..., "code":"<div..."}), рекурсивно распаковываем его,
// пока не получим чистый HTML/JS. Чистый HTML никогда не начинается с '{' или '"',
// поэтому такие строки не затрагиваются.
// Эвристический «мусорный» остаток: строка, которая выглядит как хвост сериализованного
// JSON (например `"}],"desktopApps":"[]"};`) — такое никогда не бывает нормальным HTML.
const isJsonGarbage = (s: string): boolean => {
  const t = s.trim();
  if (!t) return false;
  if (/^[}\];"]/.test(t)) return true;                      // начинается с закрывающих скобок/кавычек
  if (!t.includes('<') && /["{}]|;$/.test(t) && /^[^<>]*["}]/.test(t)) return true; // без тегов, но с JSON-символами
  return false;
};

// Признаки двойного JSON-кодирования: много экранированных последовательностей \" и \n
// как текста. Чистый HTML содержит такие последовательности крайне редко, поэтому
// требуем несколько вхождений подряд, чтобы не повредить код с редкими \" внутри.
const looksDoubleEncoded = (s: string): boolean => {
  return (s.match(/\\"/g)?.length || 0) >= 3 || (s.match(/\\n/g)?.length || 0) >= 3;
};

const unwrapDoubleEncoded = (input: string, depth = 0): string => {
  if (depth > 5) return input;
  const code = input.trim();
  // Чистый HTML (начинается с тега/комментария) и не похож на escaped-JSON — не трогаем
  const startsLikeHtml = code.startsWith('<') && !looksDoubleEncoded(code);
  if (!startsLikeHtml && (code.startsWith('{') || code.startsWith('"'))) {
    try {
      const parsed = JSON.parse(code);
      if (typeof parsed === 'string') return unwrapDoubleEncoded(parsed, depth + 1);
      if (parsed && typeof parsed === 'object' && typeof parsed.code === 'string') {
        return unwrapDoubleEncoded(parsed.code, depth + 1);
      }
    } catch { /* не JSON — это обычный код, оставляем как есть */ }
  }
  // Следы двойного кодирования (\" и \n как текст) — пробуем распаковать один уровень.
  if (looksDoubleEncoded(code)) {
    try {
      const parsed = JSON.parse(`"${code}"`);
      if (typeof parsed === 'string' && parsed !== code) {
        return unwrapDoubleEncoded(parsed, depth + 1);
      }
    } catch { /* не удалось — оставляем как есть */ }
  }
  return code;
};

const normalizeAppCode = (raw: unknown): string => {
  let out = '';
  if (typeof raw !== 'string') {
    // Защита на случай, если code пришёл как объект (например, сохранён без сериализации)
    if (raw && typeof raw === 'object' && typeof (raw as any).code === 'string') {
      out = unwrapDoubleEncoded((raw as any).code);
    }
  } else {
    out = unwrapDoubleEncoded(raw);
  }
  // Страж: никогда не выводим в интерфейс обрывки сериализованного JSON.
  // Если после всех распаковок результат выглядит как JSON-мусор и не содержит
  // ни одного HTML-тега — считаем его непригодным и показываем заглушку вместо сырых данных.
  if (isJsonGarbage(out) && !/<[a-zA-Z!/]/.test(out)) {
    return '<div style="display:flex;align-items:center;justify-content:center;height:100vh;' +
      'font-family:sans-serif;color:#888;background:transparent;font-size:14px;text-align:center;padding:20px;">' +
      'Данные приложения повреждены.<br/>Удалите приложение из Custom Apps и добавьте снова.</div>';
  }
  return out;
};

const EAppRenderer: React.FC<EAppRendererProps> = ({ app }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, setSettings, customApps, setCustomApps } = useAppContext();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // ===== Pinch-to-zoom (два пальца / колесо + Ctrl) =====
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const pinchState = useRef<{ dist: number; startZoom: number } | null>(null);
  const panState = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, [app.id]);

  const touchDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchState.current = { dist: touchDist(e.touches), startZoom: zoom };
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchState.current) {
      e.preventDefault();
      const ratio = touchDist(e.touches) / pinchState.current.dist;
      setZoom(Math.min(3, Math.max(1, pinchState.current.startZoom * ratio)));
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchState.current = null;
    if (e.touches.length === 0 && zoom <= 1.01) setPan({ x: 0, y: 0 });
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    setZoom(z => Math.min(3, Math.max(1, z - e.deltaY * 0.005)));
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1.05) {
      panState.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (panState.current && zoom > 1) {
      setPan({
        x: panState.current.px + (e.clientX - panState.current.x),
        y: panState.current.py + (e.clientY - panState.current.y),
      });
    }
  };
  const handleMouseUp = () => { panState.current = null; };
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  
  const appVersion = getEAppVersion(app);
  const isV2 = appVersion === '1.1';

  useEffect(() => {
    if (app.supportedModels && app.supportedModels.length > 0) {
      if (!app.supportedModels.includes(settings.phoneModel)) {
        setShowCompatibilityModal(true);
        return;
      }
    }
    setAppReady(true);
  }, [app, settings.phoneModel]);

  useEffect(() => {
    if (!containerRef.current || !appReady) return;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: transparent;';
    // Без allow-same-origin: iframe изолирован (без доступа к localStorage/origin родителя),
    // что закрывает предупреждение браузера о возможности побега из sandbox.
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-modals');
    iframe.sandbox.add('allow-popups');
    iframe.sandbox.add('allow-forms');
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);

    const ePhoneAPI = `
      <script>
        // Страж на случай, если srcdoc пришёл обрезанным (сломанный синтаксис инлайн-скрипта):
        // в iframe остаётся только этот валидный скрипт, а битый хвост выводится как текст.
        // Показываем аккуратную заглушку вместо «сырого кода».
        window.addEventListener('error', function (ev) {
          if (ev && ev.message && /Invalid or unexpected token|Unexpected end of input|Unexpected string/.test(ev.message)) {
            try {
              document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;' +
                'font-family:sans-serif;color:#888;font-size:14px;text-align:center;padding:20px;">' +
                '\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0435 \u0437\u0430\u043f\u0443\u0441\u0442\u0438\u043b\u043e\u0441\u044c: \u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u043e\u0432\u0440\u0435\u0436\u0434\u0435\u043d\u044b.<br/>' +
                '\u041f\u0435\u0440\u0435\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0438\u0437 App Store \u0438\u043b\u0438 Custom Apps.</div>';
            } catch (e) {}
          }
        });
        window.ePhone = {
          version: '${appVersion}',
          getScreenSize: () => ({ width: 390, height: 700 }),
          vibrate: (pattern) => { if (navigator.vibrate) navigator.vibrate(pattern); },
          save: (key, value) => { window.parent.postMessage({ type: 'storage', op: 'set', key: 'eapp_${app.id}_' + key, value: JSON.stringify(value) }, '*'); },
          load: (key) => { const fullKey = 'eapp_${app.id}_' + key;
            if (window.__ephoneStorageCache && Object.prototype.hasOwnProperty.call(window.__ephoneStorageCache, fullKey)) {
              try { return JSON.parse(window.__ephoneStorageCache[fullKey]); } catch { return null; }
            }
            window.parent.postMessage({ type: 'storage', op: 'get', key: fullKey }, '*');
            return null; },
          closeApp: () => { window.parent.postMessage({ type: 'closeApp' }, '*'); },
          notify: (title, body) => { window.parent.postMessage({ type: 'notify', title, body }, '*'); },
          getWeatherCity: () => { try { return (window.__ephoneStorageCache || {})['ephone_weather_city'] || 'Москва'; } catch { return 'Москва'; } },
          setWeatherCity: (city) => { window.parent.postMessage({ type: 'weatherCity', city }, '*'); },
          getSettings: () => { return ${JSON.stringify(settings)}; },
          getModel: () => { return '${settings.phoneModel}'; },
          setSettings: (newSettings) => { window.parent.postMessage({ type: 'setSettings', settings: newSettings }, '*'); },
          switchModel: (model) => { window.parent.postMessage({ type: 'switchModel', model: model }, '*'); },
          getAppInfo: () => { return { id: '${app.id}', name: '${app.name}', version: '${appVersion}', author: '${app.author || 'Unknown'}' }; },
          storage: (op, key, value) => {
            const allowed = ['customApps', 'desktopApps'];
            if (!allowed.includes(key)) return null;
            if (op === 'set') { window.parent.postMessage({ type: 'storage', op: 'set', key, value }, '*'); return true; }
            return (window.__ephoneStorageCache || {})[key] || null;
          }
        };
      <\/script>
    `;

    let externalLibsHTML = '';
    if (isV2 && (app as any).externalLibs) {
      const libs = (app as any).externalLibs;
      if (libs.css) externalLibsHTML += libs.css.map((url: string) => `<link rel="stylesheet" href="${url}">`).join('\n');
      if (libs.js) externalLibsHTML += libs.js.map((url: string) => `<script src="${url}"><\/script>`).join('\n');
    }

    let customStyleHTML = '';
    if (isV2 && (app as any).style) {
      customStyleHTML = `<style>${(app as any).style}</style>`;
    }

    let backgroundStyle = settings.darkMode ? '#000' : '#fff';
    if (isV2 && (app as any).background) backgroundStyle = (app as any).background;

    // Снимок разрешённых ключей хранилища (iframe изолирован и не имеет доступа к localStorage родителя)
    const storageSnapshot: Record<string, string | null> = {};
    try {
      for (const k of ['customApps', 'desktopApps', 'ephone_weather_city']) {
        const v = localStorage.getItem(k);
        if (v !== null) storageSnapshot[k] = v;
      }
      const prefix = 'eapp_' + app.id + '_';
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) storageSnapshot[k] = localStorage.getItem(k);
      }
    } catch {}

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
        ${externalLibsHTML}
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            overflow-x: hidden;
            background: ${backgroundStyle};
            color: ${settings.darkMode ? '#fff' : '#000'};
          }
          ::-webkit-scrollbar { width: 0; height: 0; display: none; }
          * { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        </style>
        ${customStyleHTML}
        <script>window.__ephoneStorageCache = ${JSON.stringify(storageSnapshot)};<\/script>
        ${ePhoneAPI}
      </head>
      <body>${normalizeAppCode(app.code)}</body>
      </html>
    `;

    iframe.srcdoc = html;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'closeApp') {
        window.dispatchEvent(new CustomEvent('closeEApp'));
      } else if (event.data?.type === 'setSettings') {
        setSettings(prev => ({ ...prev, ...event.data.settings }));
      } else if (event.data?.type === 'storage') {
        const { op, key, value } = event.data;
        if (typeof key !== 'string') return;
        const isAllowed = key === 'customApps' || key === 'desktopApps' || key.startsWith('eapp_');
        if (!isAllowed) return;
        try {
          if (op === 'set') {
            localStorage.setItem(key, value);
            window.dispatchEvent(new CustomEvent('eappStorageChanged', { detail: { key, value } }));
          } else if (op === 'get') {
            iframe.contentWindow?.postMessage({ type: 'storageResult', key, value: localStorage.getItem(key) }, '*');
          }
        } catch {}
      } else if (event.data?.type === 'switchModel') {
        const model = event.data.model as PhoneModel;
        setSettings(s => ({ ...s, phoneModel: model, disableIsland: model !== 'iphone14' ? true : s.disableIsland }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [app, appReady, settings, setSettings, isV2, appVersion]);

  // Синхронизация React-состояния при записи системных ключей из изолированного iframe
  useEffect(() => {
    const onStorageChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string; value: string };
      if (!detail) return;
      if (detail.key === 'customApps') {
        try {
          const parsed = JSON.parse(detail.value);
          if (Array.isArray(parsed)) {
            setCustomApps(prev => {
              const system = prev.filter(a => a.isSystem);
              const injected = parsed.filter((a: EApp) => !system.find(s2 => s2.id === a.id));
              return [...system, ...injected];
            });
          }
        } catch {}
      } else if (detail.key === 'desktopApps') {
        try { JSON.parse(detail.value); } catch {}
      }
    };
    window.addEventListener('eappStorageChanged', onStorageChanged);
    return () => window.removeEventListener('eappStorageChanged', onStorageChanged);
  }, [setCustomApps]);

  const handleSwitchModel = (model: PhoneModel) => {
    setSettings(s => ({ ...s, phoneModel: model, disableIsland: model !== 'iphone14' ? true : s.disableIsland }));
    setShowCompatibilityModal(false);
    setAppReady(true);
  };

  if (showCompatibilityModal) {
    return (
      <div className="w-full h-full bg-black/90 flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-xs border border-white/10">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3 animate-bounce-in">{typeof app.icon === 'string' && !app.icon.startsWith('material:') ? app.icon : '📱'}</div>
            <h3 className="text-white text-lg font-bold">{app.name}</h3>
            <p className="text-gray-400 text-sm mt-2">Оптимизировано для:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {app.supportedModels?.map(model => (
                <span key={model} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
                  {model === 'iphone8' ? 'ePhone 8' : model === 'iphonex' ? 'ePhone X' : 'ePhone 14'}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {app.supportedModels?.map(model => (
              <button key={model} onClick={() => handleSwitchModel(model)}
                className={`w-full py-3 rounded-2xl font-medium text-sm transition-all active:scale-95 ${
                  settings.phoneModel === model ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}>
                Переключить на {model === 'iphone8' ? 'ePhone 8' : model === 'iphonex' ? 'ePhone X' : 'ePhone 14'}
              </button>
            ))}
            <button onClick={() => { setShowCompatibilityModal(false); setAppReady(true); }}
              className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors">
              Запустить всё равно
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden touch-none select-none"
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div ref={containerRef} className="w-full h-full" style={{
        minHeight: '100%',
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: 'center center',
        transition: pinchState.current || panState.current ? 'none' : 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
      }} />
      {zoom > 1.02 && (
        <button onClick={resetZoom}
          className="absolute bottom-4 right-3 px-3 py-1.5 glass-dark rounded-full text-white text-xs font-semibold shadow-lg active:scale-90 transition-transform z-10">
          {Math.round(zoom * 100)}% ✕
        </button>
      )}
    </div>
  );
};

export default EAppRenderer;
