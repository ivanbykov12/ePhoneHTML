import React from 'react';
import { PhoneModel } from '../context/AppContext';

interface StatusBarProps {
  time: Date;
  model: PhoneModel;
}

const StatusBar: React.FC<StatusBarProps> = ({ time, model }) => {
  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const paddingTop = model === 'iphone8' ? '8px' : model === 'iphonex' ? '32px' : '14px';

  return (
    <div
      className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-8"
      style={{ paddingTop, height: model === 'iphone8' ? '30px' : '48px' }}
    >
      <span className="text-white text-sm font-semibold">{timeStr}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg className="w-4 h-3 text-white" viewBox="0 0 20 14" fill="currentColor">
          <rect x="0" y="8" width="3" height="6" rx="1" opacity="0.4"/>
          <rect x="5" y="5" width="3" height="9" rx="1" opacity="0.6"/>
          <rect x="10" y="2" width="3" height="12" rx="1" opacity="0.8"/>
          <rect x="15" y="0" width="3" height="14" rx="1"/>
        </svg>
        {/* WiFi */}
        <svg className="w-4 h-3 text-white" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3.5 7.5a6.5 6.5 0 019 0l-1 1a5 5 0 00-7 0l-1-1zM1 5a9.5 9.5 0 0114 0l-1 1a8 8 0 00-12 0L1 5z" opacity="0.9"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="w-6 h-3 border border-white/80 rounded-sm relative">
            <div className="absolute inset-0.5 bg-green-400 rounded-sm" style={{width: '75%'}}/>
          </div>
          <div className="w-0.5 h-1.5 bg-white/80 rounded-r-sm ml-px"/>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
