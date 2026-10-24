import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const SettingsApp: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const wallpapers = [
    { id: 'gradient1', name: 'Фиолетовый', preview: 'from-purple-900 via-blue-900 to-black' },
    { id: 'gradient2', name: 'Закат', preview: 'from-pink-900 via-red-900 to-orange-900' },
    { id: 'gradient3', name: 'Океан', preview: 'from-green-900 via-teal-900 to-cyan-900' },
    { id: 'gradient4', name: 'Космос', preview: 'from-indigo-900 via-purple-900 to-pink-900' },
    { id: 'dark', name: 'Тёмный', preview: 'from-gray-900 to-black' },
  ];

  const accentColors = [
    { id: '#007AFF', name: 'Синий' },
    { id: '#FF3B30', name: 'Красный' },
    { id: '#34C759', name: 'Зелёный' },
    { id: '#FF9500', name: 'Оранжевый' },
    { id: '#AF52DE', name: 'Фиолетовый' },
    { id: '#FF2D55', name: 'Розовый' },
  ];

  if (activeSection === 'wallpaper') {
    return (
      <div className="w-full h-full bg-black pt-16 px-4 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Обои</h2>
        </div>
        <div className="space-y-3">
          {wallpapers.map(wp => (
            <div
              key={wp.id}
              className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
                settings.wallpaper === wp.id ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800'
              }`}
              onClick={() => setSettings(s => ({ ...s, wallpaper: wp.id }))}
            >
              <div className={`w-16 h-24 rounded-lg bg-gradient-to-b ${wp.preview}`} />
              <span className="text-white">{wp.name}</span>
              {settings.wallpaper === wp.id && <span className="ml-auto text-blue-400">✓</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'display') {
    return (
      <div className="w-full h-full bg-black pt-16 px-4 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Экран и яркость</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Яркость</div>
            <input
              type="range"
              min="30"
              max="100"
              value={settings.brightness}
              onChange={(e) => setSettings(s => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full accent-blue-500"
            />
            <div className="text-gray-400 text-xs mt-1">{settings.brightness}%</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-3">Размер текста</div>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    settings.fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-3">Цвет акцента</div>
            <div className="flex gap-3 flex-wrap">
              {accentColors.map(color => (
                <div
                  key={color.id}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    settings.accentColor === color.id ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.id }}
                  onClick={() => setSettings(s => ({ ...s, accentColor: color.id }))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'general') {
    return (
      <div className="w-full h-full bg-black pt-16 px-4 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Основные</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Имя устройства</div>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings(s => ({ ...s, name: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Язык</div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option>Русский</option>
              <option>English</option>
              <option>Deutsch</option>
              <option>Français</option>
            </select>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Тактильный отклик</span>
              <button
                onClick={() => setSettings(s => ({ ...s, haptic: !s.haptic }))}
                className={`w-12 h-7 rounded-full transition-colors ${settings.haptic ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.haptic ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Звуки</span>
              <button
                onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))}
                className={`w-12 h-7 rounded-full transition-colors ${settings.sound ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.sound ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black pt-16 px-4 overflow-y-auto pb-20">
      <h1 className="text-white text-2xl font-bold mb-6">Настройки</h1>

      {/* Profile */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <div className="text-white font-semibold">{settings.name}</div>
          <div className="text-gray-400 text-xs">Apple ID, iCloud и др.</div>
        </div>
        <span className="ml-auto text-gray-500">›</span>
      </div>

      {/* Settings List */}
      <div className="space-y-1">
        <SettingItem icon="📶" label="Wi-Fi" value="Подключено" />
        <SettingItem icon="📱" label="Bluetooth" value="Вкл." />
        <SettingItem icon="✈️" label="Авиарежим" toggle={false} />
        <div className="cursor-pointer" onClick={() => setActiveSection('general')}>
          <SettingItem icon="⚙️" label="Основные" />
        </div>
        <div className="cursor-pointer" onClick={() => setActiveSection('display')}>
          <SettingItem icon="🔆" label="Экран и яркость" />
        </div>
        <div className="cursor-pointer" onClick={() => setActiveSection('wallpaper')}>
          <SettingItem icon="🖼" label="Обои" />
        </div>
        <SettingItem icon="🔔" label="Уведомления" toggle={settings.notifications} onToggle={() => setSettings(s => ({ ...s, notifications: !s.notifications }))} />
        <SettingItem icon="🔊" label="Звуки" value={settings.sound ? 'Вкл.' : 'Выкл.'} />
        <SettingItem icon="🌙" label="Не беспокоить" toggle={false} />
        <SettingItem icon="🔋" label="Аккумулятор" value="87%" />
        <SettingItem icon="🔒" label="Конфиденциальность" />
        <SettingItem icon="ℹ️" label="Об устройстве" value="iPhone 15 Pro" />
      </div>

      {/* System Info */}
      <div className="mt-6 text-center text-gray-500 text-xs">
        <p>iOS Simulator v1.0</p>
        <p className="mt-1">Сделано с ❤️</p>
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  toggle?: boolean;
  onToggle?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value, toggle, onToggle }) => (
  <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3">
    <span className="text-lg">{icon}</span>
    <span className="text-white text-sm flex-1">{label}</span>
    {value && <span className="text-gray-400 text-xs mr-2">{value}</span>}
    {toggle !== undefined ? (
      <button
        onClick={onToggle}
        className={`w-12 h-7 rounded-full transition-colors ${toggle ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggle ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    ) : (
      <span className="text-gray-500">›</span>
    )}
  </div>
);

export default SettingsApp;
