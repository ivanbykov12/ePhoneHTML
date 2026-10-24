import React, { createContext, useContext } from 'react';

export type PhoneModel = 'iphone8' | 'iphonex' | 'iphone14';

export const getStatusBarPadding = (model: PhoneModel): string => {
  switch (model) {
    case 'iphone8': return '90px';
    case 'iphonex': return '44px';
    case 'iphone14': return '54px';
  }
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
};

interface AppContextType {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useAppContext = () => useContext(AppContext);
