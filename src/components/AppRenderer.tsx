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
  const paddingTop = getStatusBarPadding(settings.phoneModel);

  // Все приложения теперь .eapp
  const app = customApps.find(a => a.id === appName);

  if (!app) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white" style={{ paddingTop }}>
        Приложение не найдено: {appName}
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
