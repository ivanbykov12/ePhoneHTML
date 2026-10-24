import React, { useEffect, useRef } from 'react';
import { EApp } from '../context/AppContext';

interface EAppRendererProps {
  app: EApp;
}

const EAppRenderer: React.FC<EAppRendererProps> = ({ app }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем iframe для изоляции
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: transparent;';
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-same-origin');
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);

    // API для приложений
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
            return {};
          }
        };
      </script>
    `;

    // Полный HTML документ
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            overflow-x: hidden;
            background: #000;
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

    // Обработка сообщений от iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'closeApp') {
        // Отправляем событие закрытия наверх
        window.dispatchEvent(new CustomEvent('closeEApp'));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [app]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
};

export default EAppRenderer;
