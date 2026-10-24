import React, { createContext, useContext } from 'react';

export type PhoneModel = 'iphone8' | 'iphonex' | 'iphone14';

export const getStatusBarPadding = (model: PhoneModel): string => {
  switch (model) {
    case 'iphone8': return '90px';
    case 'iphonex': return '44px';
    case 'iphone14': return '54px';
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
  code: string;
  supportedModels?: PhoneModel[];
  isSystem?: boolean;
  changelog?: string;
}

export interface LockScreenWidget {
  id: string;
  type: 'weather' | 'battery' | 'calendar' | 'fitness' | 'clock' | 'music';
  position: 'top' | 'bottom-left' | 'bottom-right';
}

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
