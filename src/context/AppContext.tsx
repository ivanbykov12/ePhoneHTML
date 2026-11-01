import React, { createContext, useContext } from 'react';

export type PhoneModel = 'iphone8' | 'iphonex' | 'iphone14' | 'epad101';

export const getStatusBarPadding = (model: PhoneModel): string => {
  switch (model) {
    case 'iphone8': return '20px';
    case 'iphonex': return '50px';
    case 'iphone14': return '54px';
    case 'epad101': return '25px';
  }
};

// Нижняя safe area для полноэкранных оверлеев (AOD, тёмный экран).
// iPhone 8 имеет физическую нижнюю рамку 80px с кнопкой Home — оверлеи
// должны обрезаться по ней, иначе перекрывают кнопку.
// Для дока рабочего стола используется getDockBottomInset (там рамка уже
// учтена контейнером экрана).
export const getBottomSafeArea = (model: PhoneModel): number => {
  switch (model) {
    case 'iphone8': return 80;
    case 'iphonex': return 34;
    case 'iphone14': return 34;
    case 'epad101': return 20;
  }
};

// Отступ снизу для дока/контента рабочего стола (без учёта физической рамки).
export const getDockBottomInset = (model: PhoneModel): number => {
  switch (model) {
    case 'iphone8': return 0;
    case 'iphonex': return 34;
    case 'iphone14': return 34;
    case 'epad101': return 20;
  }
};

export interface EApp {
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
  eappVersion?: '1.0' | '1.1';
  style?: string;
  background?: string;
  orientation?: 'portrait' | 'landscape' | 'auto';
  fullscreen?: boolean;
  externalLibs?: { css?: string[]; js?: string[] };
  permissions?: { vibration?: boolean; notifications?: boolean; camera?: boolean; location?: boolean; storage?: boolean };
  metadata?: { category?: string; tags?: string[]; minOS?: string; website?: string; email?: string };
  launchConfig?: { splashScreen?: boolean; splashDuration?: number; animation?: 'fade' | 'slide' | 'zoom' | 'none' };
}

export const getEAppVersion = (app: EApp): '1.0' | '1.1' => {
  if ('eappVersion' in app && app.eappVersion === '1.1') return '1.1';
  return '1.0';
};

export type AODPosition = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const AOD_POSITION_LABELS: Record<AODPosition, string> = {
  'top-left': 'Сверху слева',
  'top-center': 'Сверху по центру',
  'top-right': 'Сверху справа',
  'center': 'По центру',
  'bottom-left': 'Снизу слева',
  'bottom-center': 'Снизу по центру',
  'bottom-right': 'Снизу справа',
};

export interface SystemSettings {
  aodEnabled: boolean;
  aodPosition: AODPosition;
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
  welcomeCompleted: boolean;
  region: string;
  multiTasking: boolean;
  homeScreenLayout: string[];
}

export const defaultSettings: SystemSettings = {
  aodEnabled: true,
  aodPosition: 'top-center',
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
  welcomeCompleted: false,
  region: 'Россия',
  multiTasking: false,
  homeScreenLayout: [],
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
