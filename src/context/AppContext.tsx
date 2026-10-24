import React, { createContext, useContext } from 'react';

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
  name: 'iPhone',
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
