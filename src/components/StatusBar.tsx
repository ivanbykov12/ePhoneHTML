import React from 'react';

interface StatusBarProps {
  time: Date;
}

const StatusBar: React.FC<StatusBarProps> = ({ time }) => {
  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-8 pt-3 h-12">
      <span className="text-white text-sm font-semibold">{timeStr}</span>
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
        <svg className="w-5 h-3 text-white" fill="currentColor" viewBox="0 0 24 14">
          <rect x="0" y="3" width="2" height="11" rx="0.5" opacity="0.4"/>
          <rect x="4" y="2" width="2" height="12" rx="0.5" opacity="0.6"/>
          <rect x="8" y="1" width="2" height="13" rx="0.5" opacity="0.8"/>
          <rect x="12" y="0" width="2" height="14" rx="0.5"/>
        </svg>
        <div className="flex items-center">
          <div className="w-6 h-3 border border-white rounded-sm relative">
            <div className="absolute inset-0.5 bg-green-400 rounded-sm" style={{width: '75%'}}/>
          </div>
          <div className="w-0.5 h-1.5 bg-white rounded-r ml-0.5"/>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
