import React, { useState } from 'react';
import { useAppContext, getStatusBarPadding, EApp, getEAppVersion } from '../context/AppContext';
import { FolderOpen, Upload, Download, Trash2 } from 'lucide-react';

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp }) => {
  const { settings, customApps, setCustomApps } = useAppContext();
  const paddingTop = getStatusBarPadding(settings.phoneModel);
  const [showCustomApps, setShowCustomApps] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  // Разделяем системные и пользовательские .eapp приложения
  const systemEApps = customApps.filter(app => app.isSystem);
  const userEApps = customApps.filter(app => !app.isSystem);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const appData = JSON.parse(text);
      
      if (!appData.id || !appData.name || !appData.code) {
        alert('Неверный формат .eapp файла! Нужны поля: id, name, code');
        return;
      }

      setCustomApps(prev => [...prev.filter(a => a.id !== appData.id), appData]);
      setShowUpload(false);
      alert(`Приложение "${appData.name}" добавлено!`);
    } catch (err) {
      alert('Ошибка чтения файла. Убедитесь что это валидный .eapp JSON файл.');
      console.error(err);
    }
  };

  const handleDeleteApp = (app: EApp) => {
    if (confirm(`Удалить "${app.name}"?`)) {
      setCustomApps(prev => prev.filter(a => a.id !== app.id));
    }
  };

  const handleDownloadApp = (app: EApp) => {
    const blob = new Blob([JSON.stringify(app, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.id}.eapp`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderAppIcon = (app: EApp) => {
    const isMaterial = app.icon?.startsWith('material:');
    const iconContent = isMaterial ? app.icon.replace('material:', '') : (app.icon || '📱');
    const eappVersion = getEAppVersion(app);
    
    return (
      <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg relative`}>
        {isMaterial ? (
          <span className="material-icons text-white text-2xl">{iconContent}</span>
        ) : (
          <span className="text-2xl">{iconContent}</span>
        )}
        {/* Версия .eapp */}
        <div className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-black/70 rounded text-[7px] text-white font-bold">
          v{eappVersion}
        </div>
      </div>
    );
  };

  if (showCustomApps) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-gray-900 to-black flex flex-col`} style={{ paddingTop }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => setShowCustomApps(false)} className="text-blue-400 text-sm">← Назад</button>
          <h1 className="text-white text-lg font-bold">Custom Apps</h1>
          <button onClick={() => setShowUpload(true)} className="text-blue-400">
            <Upload className="w-5 h-5" />
          </button>
        </div>

        {showUpload && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-xs">
              <h3 className="text-white text-lg font-bold mb-4">Загрузить .eapp</h3>
              <p className="text-gray-400 text-sm mb-4">
                Выберите .eapp файл для добавления в симулятор
              </p>
              <label className="block w-full py-3 bg-blue-500 rounded-xl text-white text-center font-bold cursor-pointer active:scale-95 transition-transform">
                Выбрать файл
                <input
                  type="file"
                  accept=".eapp,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowUpload(false)}
                className="w-full mt-3 py-2 text-gray-400 text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 px-4 overflow-y-auto">
          {userEApps.length === 0 ? (
            <div className="text-center py-20">
              <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Нет пользовательских приложений</p>
              <p className="text-gray-500 text-xs mt-2">
                Добавьте .eapp файлы в папку<br/>public/apps/ или загрузите через кнопку ↑
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userEApps.map(app => (
                <div
                  key={app.id}
                  className="bg-gray-800 rounded-xl p-3 flex items-center gap-3"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-xl shadow-lg cursor-pointer flex-shrink-0`}
                    onClick={() => onOpenApp(app.id)}
                  >
                    {app.icon?.startsWith('material:') ? (
                      <span className="material-icons text-white">{app.icon.replace('material:', '')}</span>
                    ) : (
                      <span>{app.icon || '📱'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenApp(app.id)}>
                    <div className="text-white text-sm font-medium truncate">{app.name}</div>
                    <div className="text-gray-400 text-xs truncate">
                      {app.description || app.author || 'Custom App'}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownloadApp(app)}
                      className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteApp(app)}
                      className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-xs">
              💡 <span className="text-gray-300 font-medium">Совет:</span> Системные приложения в <code className="bg-gray-700 px-1 rounded">public/apps/system/</code>. Пользовательские - в <code className="bg-gray-700 px-1 rounded">public/apps/</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-b ${getWallpaper(settings.wallpaper)} flex flex-col`} style={{ paddingTop }}>
      {/* App Grid */}
      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {/* Системные .eapp приложения */}
          {systemEApps.map(app => (
            <div
              key={app.id}
              className="flex flex-col items-center app-icon cursor-pointer relative"
              onClick={() => onOpenApp(app.id)}
            >
              {renderAppIcon(app)}
              {/* Индикатор системного приложения */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                <span className="text-white text-[8px] font-bold">S</span>
              </div>
              <span className="text-white text-[10px] mt-1 text-center leading-tight truncate w-16">
                {app.name}
              </span>
            </div>
          ))}

          {/* Custom Apps Folder */}
          <div
            className="flex flex-col items-center app-icon cursor-pointer"
            onClick={() => setShowCustomApps(true)}
          >
            <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative">
              <FolderOpen className="w-7 h-7 text-white" strokeWidth={1.8} />
              {userEApps.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{userEApps.length}</span>
                </div>
              )}
            </div>
            <span className="text-white text-[10px] mt-1 text-center leading-tight truncate w-16">
              Custom Apps
            </span>
          </div>
        </div>
      </div>

      {/* Page Dots */}
      <div className="flex justify-center gap-1 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      {/* Dock */}
      <div className="mx-4 mb-4 px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[22px]">
        <div className="flex justify-around">
          {['safari_system', 'messages_system', 'music_system', 'appstore_system'].map(appId => {
            const app = systemEApps.find(a => a.id === appId);
            if (!app) return null;
            return (
              <div
                key={app.id}
                className="app-icon cursor-pointer"
                onClick={() => onOpenApp(app.id)}
              >
                {renderAppIcon(app)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getWallpaper(wallpaper: string): string {
  const wallpapers: Record<string, string> = {
    gradient1: 'from-indigo-900 via-purple-800 to-black',
    gradient2: 'from-rose-900 via-orange-800 to-amber-900',
    gradient3: 'from-emerald-900 via-teal-800 to-cyan-900',
    gradient4: 'from-violet-900 via-fuchsia-800 to-pink-900',
    dark: 'from-gray-900 to-black',
    light: 'from-blue-200 via-purple-200 to-pink-200',
  };
  return wallpapers[wallpaper] || wallpapers.gradient1;
}

export default HomeScreen;
