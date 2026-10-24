import React, { createContext, useContext } from 'react';

export type PhoneModel = 'iphone8' | 'iphonex' | 'iphone14';

export const getStatusBarPadding = (model: PhoneModel): string => {
  switch (model) {
    case 'iphone8': return '90px';
    case 'iphonex': return '44px';
    case 'iphone14': return '54px';
  }
};

// EApp v1.0 - старая версия (обратная совместимость)
export interface EAppV1 {
  id: string;
  name: string;
  icon: string;
  color: string;
  version?: string;
  author?: string;
  description?: string;
  supportedModels?: PhoneModel[];
  isSystem?: boolean;
  changelog?: string;
  code: string;
}

// EApp v1.1 - новая версия с расширенными возможностями
export interface EAppV2 {
  id: string;
  name: string;
  icon: string;
  color: string;
  version?: string;
  author?: string;
  description?: string;
  supportedModels?: PhoneModel[];
  isSystem?: boolean;
  changelog?: string;
  code: string;
  
  // Новые возможности v1.1
  eappVersion?: '1.0' | '1.1';
  
  // Кастомные стили (не зависят от темы сайта)
  style?: string;
  
  // Фон приложения
  background?: string;
  
  // Ориентация
  orientation?: 'portrait' | 'landscape' | 'auto';
  
  // Полноэкранный режим
  fullscreen?: boolean;
  
  // Внешние библиотеки
  externalLibs?: {
    css?: string[];
    js?: string[];
  };
  
  // Разрешения
  permissions?: {
    vibration?: boolean;
    notifications?: boolean;
    camera?: boolean;
    location?: boolean;
    storage?: boolean;
  };
  
  // Метаданные
  metadata?: {
    category?: string;
    tags?: string[];
    minOS?: string;
    website?: string;
    email?: string;
  };
  
  // Настройки запуска
  launchConfig?: {
    splashScreen?: boolean;
    splashDuration?: number;
    animation?: 'fade' | 'slide' | 'zoom' | 'none';
  };
}

export type EApp = EAppV1 | EAppV2;

// Проверка версии .eapp
export const getEAppVersion = (app: EApp): '1.0' | '1.1' => {
  if ('eappVersion' in app && app.eappVersion === '1.1') {
    return '1.1';
  }
  return '1.0';
};

export interface SystemSettings {
  wallpaper: string;
  darkMode: boolean;
  brightness: number;
  fontSize: string;
  notifications: boolean;
  haptic: boolean;
  sound: boolean;
  accentColor: string;
  language: string;
  name: string;
  phoneModel: PhoneModel;
  disableIsland: boolean;
  lockScreenWidgets: LockScreenWidget[];
  lockScreenFont: string;
  controlCenterEnabled: boolean;
}

export interface LockScreenWidget {
  id: string;
  type: 'weather' | 'battery' | 'calendar' | 'fitness' | 'clock' | 'music';
  position: 'top' | 'bottom-left' | 'bottom-right';
}

export const defaultSettings: SystemSettings = {
  wallpaper: 'gradient1',
  darkMode: true,
  brightness: 100,
  fontSize: 'medium',
  notifications: true,
  haptic: true,
  sound: true,
  accentColor: '#007AFF',
  language: 'Русский',
  name: 'ePhone',
  phoneModel: 'iphone14',
  disableIsland: false,
  lockScreenWidgets: [
    { id: '1', type: 'weather', position: 'bottom-left' },
    { id: '2', type: 'battery', position: 'bottom-right' },
  ],
  lockScreenFont: 'default',
  controlCenterEnabled: true,
};

interface AppContextType {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  customApps: EApp[];
  setCustomApps: React.Dispatch<React.SetStateAction<EApp[]>>;
  showControlCenter: boolean;
  setShowControlCenter: (v: boolean) => void;
}

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  customApps: [],
  setCustomApps: () => {},
  showControlCenter: false,
  setShowControlCenter: () => {},
});

export const useAppContext = () => useContext(AppContext);
