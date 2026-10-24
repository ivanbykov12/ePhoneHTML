import React, { useEffect, useRef, useState } from 'react';
import { EApp, useAppContext, PhoneModel } from '../context/AppContext';

interface EAppRendererProps {
  app: EApp;
}

const EAppRenderer: React.FC<EAppRendererProps> = ({ app }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, setSettings, customApps } = useAppContext();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [appReady, setAppReady] = useState(false);

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
    iframe.sandbox.add('allow-scripts');
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);

    // Полный API для приложений
    const ePhoneAPI = `
      <script>
        window.ePhone = {
          getScreenSize: () => ({ width: 390, height: 700 }),
          vibrate: (pattern) => {
            if (navigator.vibrate) navigator.vibrate(pattern);
          },
          save: (key, value) => {
            localStorage.setItem('eapp_${app.id}_' + key, JSON.stringify(value));
          },
          load: (key) => {
            const val = localStorage.getItem('eapp_${app.id}_' + key);
            return val ? JSON.parse(val) : null;
          },
          closeApp: () => {
            window.parent.postMessage({ type: 'closeApp' }, '*');
          },
          getSettings: () => {
            return ${JSON.stringify(settings)};
          },
          getModel: () => {
            return '${settings.phoneModel}';
          },
          setSettings: (newSettings) => {
            window.parent.postMessage({ type: 'setSettings', settings: newSettings }, '*');
          },
          switchModel: (model) => {
            window.parent.postMessage({ type: 'switchModel', model: model }, '*');
          }
        };
      </script>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            overflow-x: hidden;
            background: ${settings.darkMode ? '#000' : '#fff'};
            color: ${settings.darkMode ? '#fff' : '#000'};
          }
          .material-icons, .material-symbols-outlined {
            font-size: inherit;
          }
        </style>
        ${ePhoneAPI}
      </head>
      <body>
        ${app.code}
      </body>
      </html>
    `;

    iframe.srcdoc = html;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'closeApp') {
        window.dispatchEvent(new CustomEvent('closeEApp'));
      } else if (event.data?.type === 'setSettings') {
        setSettings(prev => ({ ...prev, ...event.data.settings }));
      } else if (event.data?.type === 'switchModel') {
        const model = event.data.model as PhoneModel;
        setSettings(s => ({
          ...s,
          phoneModel: model,
          disableIsland: model !== 'iphone14' ? true : s.disableIsland,
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [app, appReady, settings, setSettings]);

  const handleSwitchModel = (model: PhoneModel) => {
    setSettings(s => ({
      ...s,
      phoneModel: model,
      disableIsland: model !== 'iphone14' ? true : s.disableIsland,
    }));
    setShowCompatibilityModal(false);
    setAppReady(true);
  };

  if (showCompatibilityModal) {
    return (
      <div className="w-full h-full bg-black/90 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-xs">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{app.icon}</div>
            <h3 className="text-white text-lg font-bold">{app.name}</h3>
            <p className="text-gray-400 text-sm mt-2">
              Это приложение оптимизировано для:
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {app.supportedModels?.map(model => (
                <span key={model} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {model === 'iphone8' ? 'ePhone 8' : model === 'iphonex' ? 'ePhone X' : 'ePhone 14'}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {app.supportedModels?.map(model => (
              <button
                key={model}
                onClick={() => handleSwitchModel(model)}
                className={`w-full py-3 rounded-xl font-medium text-sm ${
                  settings.phoneModel === model
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Переключить на {model === 'iphone8' ? 'ePhone 8' : model === 'iphonex' ? 'ePhone X' : 'ePhone 14'}
              </button>
            ))}
            <button
              onClick={() => { setShowCompatibilityModal(false); setAppReady(true); }}
              className="w-full py-2 text-gray-400 text-sm mt-2"
            >
              Запустить всё равно
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
};

export default EAppRenderer;
