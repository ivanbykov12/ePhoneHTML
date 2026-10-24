import React, { useState } from 'react';
import { useAppContext, PhoneModel } from '../context/AppContext';
import { ChevronRight, Wifi, Bluetooth, Plane, Cog, Sun, Image as ImageIcon, Bell, Volume2, Moon, Battery, Lock, Info, Smartphone, MonitorOff } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const wallpapers = [
    { id: 'gradient1', name: 'Космос', preview: 'from-indigo-900 via-purple-800 to-black' },
    { id: 'gradient2', name: 'Закат', preview: 'from-rose-900 via-orange-800 to-amber-900' },
    { id: 'gradient3', name: 'Океан', preview: 'from-emerald-900 via-teal-800 to-cyan-900' },
    { id: 'gradient4', name: 'Неон', preview: 'from-violet-900 via-fuchsia-800 to-pink-900' },
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

  const phoneModels: { id: PhoneModel; name: string; desc: string }[] = [
    { id: 'iphone8', name: 'ePhone 8', desc: 'Классический с кнопкой' },
    { id: 'iphonex', name: 'ePhone X', desc: 'Безрамочный с чёлкой' },
    { id: 'iphone14', name: 'ePhone 14', desc: 'Dynamic Island' },
  ];

  if (activeSection === 'wallpaper') {
    return (
      <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6 px-4">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Обои</h2>
        </div>
        <div className="space-y-3 px-4">
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
      <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6 px-4">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Экран и яркость</h2>
        </div>
        <div className="space-y-4 px-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Яркость</div>
            <input
              type="range" min="30" max="100" value={settings.brightness}
              onChange={(e) => setSettings(s => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full accent-blue-500"
            />
            <div className="text-gray-400 text-xs mt-1">{settings.brightness}%</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-3">Размер текста</div>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button key={size} onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                  className={`flex-1 py-2 rounded-lg text-sm ${settings.fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
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
                <div key={color.id}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${settings.accentColor === color.id ? 'border-white scale-110' : 'border-transparent'}`}
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
      <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6 px-4">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Основные</h2>
        </div>
        <div className="space-y-3 px-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Имя устройства</div>
            <input type="text" value={settings.name}
              onChange={(e) => setSettings(s => ({ ...s, name: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm mb-2">Язык</div>
            <select value={settings.language}
              onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option>Русский</option>
              <option>English</option>
              <option>Deutsch</option>
              <option>Français</option>
            </select>
          </div>
          <ToggleRow label="Тактильный отклик" value={settings.haptic} onChange={() => setSettings(s => ({ ...s, haptic: !s.haptic }))} />
          <ToggleRow label="Звуки" value={settings.sound} onChange={() => setSettings(s => ({ ...s, sound: !s.sound }))} />
        </div>
      </div>
    );
  }

  if (activeSection === 'appearance') {
    return (
      <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6 px-4">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className="text-white text-lg font-bold">Внешний вид</h2>
        </div>
        <div className="space-y-4 px-4">
          {/* Phone Model */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Стиль телефона
            </div>
            <div className="space-y-2">
              {phoneModels.map(model => (
                <div
                  key={model.id}
                  onClick={() => {
                    setSettings(s => ({
                      ...s,
                      phoneModel: model.id,
                      disableIsland: model.id !== 'iphone14' ? true : s.disableIsland,
                    }));
                  }}
                  className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                    settings.phoneModel === model.id ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-white text-sm font-medium">{model.name}</div>
                    <div className="text-gray-400 text-xs">{model.desc}</div>
                  </div>
                  {settings.phoneModel === model.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Island Toggle */}
          <div className="bg-gray-800 rounded-xl p-4">
            <ToggleRow
              label="Dynamic Island"
              value={!settings.disableIsland}
              onChange={() => setSettings(s => ({ ...s, disableIsland: !s.disableIsland }))}
              disabled={settings.phoneModel !== 'iphone14'}
              disabledNote={settings.phoneModel !== 'iphone14' ? 'Только на ePhone 14' : undefined}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
      <h1 className="text-white text-2xl font-bold mb-6 px-4">Настройки</h1>

      {/* Profile */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 mx-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <div className="text-white font-semibold">{settings.name}</div>
          <div className="text-gray-400 text-xs">Epple ID, iCloud и др.</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
      </div>

      {/* Settings List */}
      <div className="space-y-1 px-4">
        <SettingRow icon={<Wifi className="w-5 h-5 text-blue-400" />} label="Wi-Fi" value="Подключено" />
        <SettingRow icon={<Bluetooth className="w-5 h-5 text-blue-400" />} label="Bluetooth" value="Вкл." />
        <SettingRow icon={<Plane className="w-5 h-5 text-orange-400" />} label="Авиарежим" toggle={false} />
        <SettingRow icon={<Cog className="w-5 h-5 text-gray-400" />} label="Основные" onClick={() => setActiveSection('general')} />
        <SettingRow icon={<Smartphone className="w-5 h-5 text-purple-400" />} label="Внешний вид" onClick={() => setActiveSection('appearance')} badge="ePhone 14" />
        <SettingRow icon={<Sun className="w-5 h-5 text-yellow-400" />} label="Экран и яркость" onClick={() => setActiveSection('display')} />
        <SettingRow icon={<ImageIcon className="w-5 h-5 text-cyan-400" />} label="Обои" onClick={() => setActiveSection('wallpaper')} />
        <SettingRow icon={<Bell className="w-5 h-5 text-red-400" />} label="Уведомления" toggle={settings.notifications} onToggle={() => setSettings(s => ({ ...s, notifications: !s.notifications }))} />
        <SettingRow icon={<Volume2 className="w-5 h-5 text-pink-400" />} label="Звуки" value={settings.sound ? 'Вкл.' : 'Выкл.'} />
        <SettingRow icon={<Moon className="w-5 h-5 text-indigo-400" />} label="Не беспокоить" toggle={false} />
        <SettingRow icon={<Battery className="w-5 h-5 text-green-400" />} label="Аккумулятор" value="87%" />
        <SettingRow icon={<Lock className="w-5 h-5 text-gray-400" />} label="Конфиденциальность" />
        <SettingRow icon={<Info className="w-5 h-5 text-gray-400" />} label="Об устройстве" value="ePhone 14" />
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs px-4">
        <p>ePhone Simulator v2.0</p>
        <p className="mt-1">Epple Inc. © 2024</p>
      </div>
    </div>
  );
};

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
  disabledNote?: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, value, onChange, disabled, disabledNote }) => (
  <div className="flex justify-between items-center">
    <div>
      <span className="text-white text-sm">{label}</span>
      {disabledNote && <div className="text-gray-500 text-xs">{disabledNote}</div>}
    </div>
    <button
      onClick={disabled ? undefined : onChange}
      className={`w-12 h-7 rounded-full transition-colors ${
        disabled ? 'bg-gray-700' : value ? 'bg-green-500' : 'bg-gray-600'
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  badge?: string;
  toggle?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, badge, toggle, onToggle, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gray-800 rounded-xl p-3 flex items-center gap-3 ${onClick ? 'cursor-pointer active:bg-gray-700' : ''}`}
  >
    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">{icon}</div>
    <span className="text-white text-sm flex-1">{label}</span>
    {badge && <span className="text-gray-400 text-xs bg-gray-700 px-2 py-0.5 rounded-full">{badge}</span>}
    {value && <span className="text-gray-400 text-xs mr-1">{value}</span>}
    {toggle !== undefined ? (
      <button onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        className={`w-12 h-7 rounded-full transition-colors ${toggle ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggle ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    ) : (
      <ChevronRight className="w-4 h-4 text-gray-500" />
    )}
  </div>
);

export default SettingsApp;
