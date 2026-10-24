import React, { useState } from 'react';

interface AppItem {
  id: string;
  name: string;
  developer: string;
  rating: number;
  size: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  installed?: boolean;
}

const storeApps: AppItem[] = [
  { id: '1', name: 'Instagram', developer: 'Meta', rating: 4.5, size: '230 MB', category: 'Соцсети', icon: '📸', color: 'from-pink-500 to-purple-600', description: 'Фото и видео' },
  { id: '2', name: 'TikTok', developer: 'ByteDance', rating: 4.3, size: '310 MB', category: 'Развлечения', icon: '🎵', color: 'from-black to-gray-800', description: 'Короткие видео' },
  { id: '3', name: 'Telegram', developer: 'Telegram', rating: 4.8, size: '150 MB', category: 'Мессенджеры', icon: '✈️', color: 'from-blue-400 to-blue-600', description: 'Быстрый мессенджер' },
  { id: '4', name: 'Spotify', developer: 'Spotify AB', rating: 4.6, size: '180 MB', category: 'Музыка', icon: '🎧', color: 'from-green-500 to-green-700', description: 'Музыкальный стриминг' },
  { id: '5', name: 'YouTube', developer: 'Google', rating: 4.4, size: '280 MB', category: 'Видео', icon: '▶️', color: 'from-red-500 to-red-700', description: 'Видео платформа' },
  { id: '6', name: 'Twitter/X', developer: 'X Corp', rating: 4.0, size: '200 MB', category: 'Соцсети', icon: '🐦', color: 'from-black to-gray-900', description: 'Микроблоги' },
  { id: '7', name: 'Netflix', developer: 'Netflix Inc', rating: 4.7, size: '120 MB', category: 'Развлечения', icon: '🎬', color: 'from-red-600 to-red-800', description: 'Фильмы и сериалы' },
  { id: '8', name: 'WhatsApp', developer: 'Meta', rating: 4.5, size: '170 MB', category: 'Мессенджеры', icon: '💬', color: 'from-green-400 to-green-600', description: 'Мессенджер' },
  { id: '9', name: 'Uber', developer: 'Uber Tech', rating: 4.2, size: '250 MB', category: 'Навигация', icon: '🚗', color: 'from-black to-gray-800', description: 'Такси и доставка' },
  { id: '10', name: 'ChatGPT', developer: 'OpenAI', rating: 4.9, size: '90 MB', category: 'Утилиты', icon: '🤖', color: 'from-emerald-500 to-teal-600', description: 'AI ассистент' },
];

const categories = ['Все', 'Соцсети', 'Развлечения', 'Мессенджеры', 'Музыка', 'Видео', 'Утилиты'];

const AppStoreApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const filteredApps = selectedCategory === 'Все'
    ? storeApps
    : storeApps.filter(a => a.category === selectedCategory);

  const handleInstall = (appId: string) => {
    setInstalled(prev => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      return next;
    });
  };

  if (selectedApp) {
    return (
      <div className="w-full h-full bg-black pt-16 px-4 overflow-y-auto pb-20">
        <button onClick={() => setSelectedApp(null)} className="text-blue-400 text-sm mb-4">← Назад</button>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedApp.color} flex items-center justify-center text-4xl shadow-lg`}>
            {selectedApp.icon}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{selectedApp.name}</h2>
            <p className="text-gray-400 text-sm">{selectedApp.developer}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(selectedApp.rating))}</span>
              <span className="text-gray-400 text-xs">{selectedApp.rating}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleInstall(selectedApp.id)}
          className={`w-full py-3 rounded-full font-bold text-sm mb-6 ${
            installed.has(selectedApp.id)
              ? 'bg-gray-700 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {installed.has(selectedApp.id) ? '✓ Установлено' : 'Установить'}
        </button>

        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-semibold mb-2">Описание</h3>
          <p className="text-gray-300 text-sm">{selectedApp.description}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Информация</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Размер</span><span className="text-white">{selectedApp.size}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Категория</span><span className="text-white">{selectedApp.category}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Рейтинг</span><span className="text-white">{selectedApp.rating} ★</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black pt-16 overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold mb-4">App Store</h1>

        {/* Search */}
        <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 mb-4">
          <span className="text-gray-400">🔍</span>
          <input type="text" placeholder="Поиск приложений" className="bg-transparent text-white text-sm flex-1 outline-none" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="px-4 mb-4">
        <h2 className="text-white font-semibold mb-3">🔥 Популярное</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {storeApps.slice(0, 4).map(app => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="min-w-[140px] cursor-pointer"
            >
              <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-5xl mb-2`}>
                {app.icon}
              </div>
              <div className="text-white text-xs font-medium truncate">{app.name}</div>
              <div className="text-gray-400 text-xs">{app.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* App List */}
      <div className="px-4">
        <h2 className="text-white font-semibold mb-3">📱 Все приложения</h2>
        <div className="space-y-3">
          {filteredApps.map((app, idx) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="flex items-center gap-3 cursor-pointer active:opacity-70"
            >
              <span className="text-gray-500 text-sm w-5">{idx + 1}</span>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl`}>
                {app.icon}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{app.name}</div>
                <div className="text-gray-400 text-xs">{app.description}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleInstall(app.id); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  installed.has(app.id) ? 'bg-gray-700 text-gray-300' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {installed.has(app.id) ? '✓' : 'GET'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppStoreApp;
