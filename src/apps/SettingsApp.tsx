import React, { useState } from 'react';
import { useAppContext, PhoneModel } from '../context/AppContext';
import { ChevronRight, Wifi, Bluetooth, Plane, Cog, Sun, Moon, Image as ImageIcon, Bell, Volume2, Battery, Lock, Info, Smartphone, Palette, User, Globe, Shield, Monitor } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const wallpapers = [
    { id: 'gradient1', name: 'Космос', preview: 'from-indigo-900 via-purple-800 to-black' },
    { id: 'gradient2', name: 'Закат', preview: 'from-rose-900 via-orange-800 to-amber-900' },
    { id: 'gradient3', name: 'Океан', preview: 'from-emerald-900 via-teal-800 to-cyan-900' },
    { id: 'gradient4', name: 'Неон', preview: 'from-violet-900 via-fuchsia-800 to-pink-900' },
    { id: 'dark', name: 'Тёмный', preview: 'from-gray-900 to-black' },
    { id: 'light', name: 'Светлый', preview: 'from-blue-200 via-purple-200 to-pink-200' },
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

  if (activeSection === 'apple-id') {
    return (
      <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
        <div className="flex items-center gap-3 mb-6 px-4 pt-2">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>Epple ID</h2>
        </div>
        <div className="px-4">
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 text-center mb-4`}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>{settings.name}</div>
            <div className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>user@epple.com</div>
          </div>
          
          <div className="space-y-2">
            <SettingRow icon={<Info className="w-5 h-5 text-blue-400" />} label="Личная информация" darkMode={settings.darkMode} />
            <SettingRow icon={<Lock className="w-5 h-5 text-gray-400" />} label="Пароль и безопасность" darkMode={settings.darkMode} />
            <SettingRow icon={<Wifi className="w-5 h-5 text-blue-400" />} label="iCloud" darkMode={settings.darkMode} />
            <SettingRow icon={<Smartphone className="w-5 h-5 text-purple-400" />} label="Устройства" darkMode={settings.darkMode} />
          </div>

          <button className="w-full mt-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium">
            Выйти из Epple ID
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'site-settings') {
    return (
      <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
        <div className="flex items-center gap-3 mb-6 px-4 pt-2">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>Настройки сайта</h2>
        </div>
        <div className="space-y-4 px-4">
          {/* Phone Model */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm font-semibold mb-3 flex items-center gap-2`}>
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
                    settings.phoneModel === model.id 
                      ? 'bg-blue-500/20 border border-blue-500' 
                      : settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <div>
                    <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{model.name}</div>
                    <div className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{model.desc}</div>
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
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <ToggleRow
              label="Dynamic Island"
              value={!settings.disableIsland}
              onChange={() => setSettings(s => ({ ...s, disableIsland: !s.disableIsland }))}
              disabled={settings.phoneModel !== 'iphone14'}
              disabledNote={settings.phoneModel !== 'iphone14' ? 'Только на ePhone 14' : undefined}
              darkMode={settings.darkMode}
            />
          </div>

          {/* Control Center Toggle */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <ToggleRow
              label="Control Center"
              value={settings.controlCenterEnabled}
              onChange={() => setSettings(s => ({ ...s, controlCenterEnabled: !s.controlCenterEnabled }))}
              darkMode={settings.darkMode}
            />
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'display') {
    return (
      <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
        <div className="flex items-center gap-3 mb-6 px-4 pt-2">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>Экран и яркость</h2>
        </div>
        <div className="space-y-4 px-4">
          {/* Dark Mode */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <ToggleRow
              label="Тёмная тема"
              value={settings.darkMode}
              onChange={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))}
              darkMode={settings.darkMode}
            />
          </div>

          {/* Brightness */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-2`}>Яркость</div>
            <input
              type="range" min="30" max="100" value={settings.brightness}
              onChange={(e) => setSettings(s => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full accent-blue-500"
            />
            <div className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>{settings.brightness}%</div>
          </div>

          {/* Font Size */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-3`}>Размер текста</div>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button key={size} onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                  className={`flex-1 py-2 rounded-lg text-sm ${settings.fontSize === size ? 'bg-blue-500 text-white' : settings.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-3`}>Цвет акцента</div>
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

  if (activeSection === 'wallpaper') {
    return (
      <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
        <div className="flex items-center gap-3 mb-6 px-4 pt-2">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>Обои</h2>
        </div>
        <div className="space-y-3 px-4">
          {wallpapers.map(wp => (
            <div
              key={wp.id}
              className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
                settings.wallpaper === wp.id ? 'bg-blue-500/20 border border-blue-500' : settings.darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={() => setSettings(s => ({ ...s, wallpaper: wp.id }))}
            >
              <div className={`w-16 h-24 rounded-lg bg-gradient-to-b ${wp.preview}`} />
              <span className={settings.darkMode ? 'text-white' : 'text-gray-900'}>{wp.name}</span>
              {settings.wallpaper === wp.id && <span className="ml-auto text-blue-400">✓</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'general') {
    return (
      <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
        <div className="flex items-center gap-3 mb-6 px-4 pt-2">
          <button onClick={() => setActiveSection(null)} className="text-blue-400 text-sm">← Назад</button>
          <h2 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>Основные</h2>
        </div>
        <div className="space-y-3 px-4">
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-2`}>Имя устройства</div>
            <input type="text" value={settings.name}
              onChange={(e) => setSettings(s => ({ ...s, name: e.target.value }))}
              className={`w-full ${settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-3 py-2 text-sm`}
            />
          </div>
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-2`}>Язык</div>
            <select value={settings.language}
              onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
              className={`w-full ${settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-3 py-2 text-sm`}
            >
              <option>Русский</option>
              <option>English</option>
              <option>Deutsch</option>
              <option>Français</option>
            </select>
          </div>
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <ToggleRow label="Тактильный отклик" value={settings.haptic} onChange={() => setSettings(s => ({ ...s, haptic: !s.haptic }))} darkMode={settings.darkMode} />
          </div>
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
            <ToggleRow label="Звуки" value={settings.sound} onChange={() => setSettings(s => ({ ...s, sound: !s.sound }))} darkMode={settings.darkMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${settings.darkMode ? 'bg-black' : 'bg-gray-100'} overflow-y-auto pb-20`}>
      <h1 className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-6 px-4 pt-2`}>Настройки</h1>

      {/* Profile */}
      <div 
        className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 mb-4 mx-4 flex items-center gap-3 cursor-pointer ${settings.darkMode ? 'active:bg-gray-700' : 'active:bg-gray-200'}`}
        onClick={() => setActiveSection('apple-id')}
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className={`${settings.darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>{settings.name}</div>
          <div className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Epple ID, iCloud и др.</div>
        </div>
        <ChevronRight className={`w-4 h-4 ${settings.darkMode ? 'text-gray-500' : 'text-gray-400'} ml-auto`} />
      </div>

      {/* Settings List */}
      <div className="space-y-1 px-4">
        <SettingRow icon={<Wifi className="w-5 h-5 text-blue-400" />} label="Wi-Fi" value="Подключено" darkMode={settings.darkMode} />
        <SettingRow icon={<Bluetooth className="w-5 h-5 text-blue-400" />} label="Bluetooth" value="Вкл." darkMode={settings.darkMode} />
        <SettingRow icon={<Plane className="w-5 h-5 text-orange-400" />} label="Авиарежим" toggle={false} darkMode={settings.darkMode} />
        <SettingRow icon={<Cog className="w-5 h-5 text-gray-400" />} label="Основные" onClick={() => setActiveSection('general')} darkMode={settings.darkMode} />
        <SettingRow icon={<Palette className="w-5 h-5 text-purple-400" />} label="Настройки сайта" onClick={() => setActiveSection('site-settings')} badge={settings.phoneModel === 'iphone14' ? 'ePhone 14' : settings.phoneModel === 'iphonex' ? 'ePhone X' : 'ePhone 8'} darkMode={settings.darkMode} />
        <SettingRow icon={<Sun className="w-5 h-5 text-yellow-400" />} label="Экран и яркость" onClick={() => setActiveSection('display')} darkMode={settings.darkMode} />
        <SettingRow icon={<ImageIcon className="w-5 h-5 text-cyan-400" />} label="Обои" onClick={() => setActiveSection('wallpaper')} darkMode={settings.darkMode} />
        <SettingRow icon={<Bell className="w-5 h-5 text-red-400" />} label="Уведомления" toggle={settings.notifications} onToggle={() => setSettings(s => ({ ...s, notifications: !s.notifications }))} darkMode={settings.darkMode} />
        <SettingRow icon={<Volume2 className="w-5 h-5 text-pink-400" />} label="Звуки" value={settings.sound ? 'Вкл.' : 'Выкл.'} darkMode={settings.darkMode} />
        <SettingRow icon={<Battery className="w-5 h-5 text-green-400" />} label="Аккумулятор" value="87%" darkMode={settings.darkMode} />
        <SettingRow icon={<Lock className="w-5 h-5 text-gray-400" />} label="Конфиденциальность" darkMode={settings.darkMode} />
        <SettingRow icon={<Info className="w-5 h-5 text-gray-400" />} label="Об устройстве" value="ePhone 14" darkMode={settings.darkMode} />
      </div>

      <div className={`mt-6 text-center ${settings.darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs px-4`}>
        <p>ePhone Simulator v3.0</p>
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
  darkMode: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, value, onChange, disabled, disabledNote, darkMode }) => (
  <div className="flex justify-between items-center">
    <div>
      <span className={`${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{label}</span>
      {disabledNote && <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>{disabledNote}</div>}
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
  darkMode: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, badge, toggle, onToggle, onClick, darkMode }) => (
  <div
    onClick={onClick}
    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 flex items-center gap-3 ${onClick ? `cursor-pointer ${darkMode ? 'active:bg-gray-700' : 'active:bg-gray-200'}` : ''}`}
  >
    <div className={`w-8 h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>{icon}</div>
    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} text-sm flex-1`}>{label}</span>
    {badge && <span className={`${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-200'} text-xs px-2 py-0.5 rounded-full`}>{badge}</span>}
    {value && <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mr-1`}>{value}</span>}
    {toggle !== undefined ? (
      <button onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        className={`w-12 h-7 rounded-full transition-colors ${toggle ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggle ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    ) : (
      <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
    )}
  </div>
);

export default SettingsApp;
