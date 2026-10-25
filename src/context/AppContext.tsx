import React, { createContext, useContext } from 'react';

export type PhoneModel = 'iphone8' | 'iphonex' | 'iphone14' | 'epad';

export const getStatusBarPadding = (model: PhoneModel): string => {
  switch (model) {
    case 'iphone8': return '20px';
    case 'iphonex': return '50px';
    case 'iphone14': return '54px';
    case 'epad': return '20px';
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
  welcomeCompleted: boolean;
  region: string;
  multiTasking: boolean;
  homeScreenLayout: string[];
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
