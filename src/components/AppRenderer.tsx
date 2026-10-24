import React from 'react';
import SnakeGame from '../apps/SnakeGame';
import TetrisGame from '../apps/TetrisGame';
import Game2048 from '../apps/Game2048';
import FlappyBird from '../apps/FlappyBird';
import SettingsApp from '../apps/SettingsApp';
import AppStoreApp from '../apps/AppStoreApp';
import CalculatorApp from '../apps/CalculatorApp';
import ClockApp from '../apps/ClockApp';
import WeatherApp from '../apps/WeatherApp';
import NotesApp from '../apps/NotesApp';
import PhotosApp from '../apps/PhotosApp';
import MusicApp from '../apps/MusicApp';
import SafariApp from '../apps/SafariApp';
import MessagesApp from '../apps/MessagesApp';
import MapsApp from '../apps/MapsApp';
import HealthApp from '../apps/HealthApp';

interface AppRendererProps {
  appName: string;
  onClose: () => void;
  onLock: () => void;
}

const AppRenderer: React.FC<AppRendererProps> = ({ appName }) => {
  const renderApp = () => {
    switch (appName) {
      case 'snake': return <SnakeGame />;
      case 'tetris': return <TetrisGame />;
      case 'game2048': return <Game2048 />;
      case 'flappy': return <FlappyBird />;
      case 'settings': return <SettingsApp />;
      case 'appstore': return <AppStoreApp />;
      case 'calculator': return <CalculatorApp />;
      case 'clock': return <ClockApp />;
      case 'weather': return <WeatherApp />;
      case 'notes': return <NotesApp />;
      case 'photos': return <PhotosApp />;
      case 'music': return <MusicApp />;
      case 'safari': return <SafariApp />;
      case 'messages': return <MessagesApp />;
      case 'maps': return <MapsApp />;
      case 'health': return <HealthApp />;
      default: return <div className="w-full h-full flex items-center justify-center text-white">Приложение не найдено</div>;
    }
  };

  return (
    <div className="w-full h-full animate-slide-up relative">
      {renderApp()}
    </div>
  );
};

export default AppRenderer;
