import React from 'react';
import { useAppContext, getStatusBarPadding } from '../context/AppContext';
import EAppRenderer from './EAppRenderer';

interface AppRendererProps {
  appName: string;
  onClose: () => void;
  onLock: () => void;
}

const AppRenderer: React.FC<AppRendererProps> = ({ appName }) => {
  const { settings, customApps } = useAppContext();
  
  // ИСПРАВЛЕНИЕ: Для планшета подняли на 10px (было 60px, стало 50px)
  const paddingTop = settings.phoneModel === 'epad101' ? '50px' : getStatusBarPadding(settings.phoneModel);
  
  const app = customApps.find(a => a.id === appName);

  if (!app) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white" style={{ paddingTop }}>
        Приложение не найдено
      </div>
    );
  }

  return (
    <div className="w-full h-full animate-slide-up relative" style={{ paddingTop }}>
      <EAppRenderer app={app} />
    </div>
  );
};

export default AppRenderer;
