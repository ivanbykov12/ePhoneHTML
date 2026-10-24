import React, { useState } from 'react';

const SafariApp: React.FC = () => {
  const [url, setUrl] = useState('apple.com');
  const [currentPage, setCurrentPage] = useState('home');

  const bookmarks = [
    { name: 'Epple', icon: '🍎', url: 'epple.com', color: 'from-gray-700 to-gray-900' },
    { name: 'Google', icon: '🔍', url: 'google.com', color: 'from-blue-400 to-blue-600' },
    { name: 'YouTube', icon: '▶️', url: 'youtube.com', color: 'from-red-500 to-red-700' },
    { name: 'GitHub', icon: '🐙', url: 'github.com', color: 'from-gray-800 to-black' },
    { name: 'Twitter', icon: '🐦', url: 'x.com', color: 'from-black to-gray-900' },
    { name: 'Reddit', icon: '🤖', url: 'reddit.com', color: 'from-orange-500 to-red-600' },
    { name: 'Wikipedia', icon: '📚', url: 'wikipedia.org', color: 'from-gray-400 to-gray-600' },
    { name: 'Stack Overflow', icon: '📋', url: 'stackoverflow.com', color: 'from-orange-400 to-orange-600' },
  ];

  const favorites = [
    { title: 'Epple - Официальный сайт', url: 'epple.com', desc: 'Инновации от Epple' },
    { title: 'React - Библиотека UI', url: 'react.dev', desc: 'Создание пользовательских интерфейсов' },
    { title: 'MDN Web Docs', url: 'developer.mozilla.org', desc: 'Документация для разработчиков' },
  ];

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      {/* URL Bar */}
      <div className="px-4 mb-3">
        <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <span className="text-gray-400 text-sm">🔒</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
            placeholder="Поиск или адрес сайта"
          />
          <button onClick={() => setCurrentPage('search')} className="text-blue-500 text-sm">→</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {currentPage === 'home' && (
          <>
            <h2 className="text-gray-800 font-semibold mb-3">Избранное</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {bookmarks.map(bm => (
                <div
                  key={bm.name}
                  onClick={() => { setUrl(bm.url); setCurrentPage('page'); }}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bm.color} flex items-center justify-center text-xl shadow-sm`}>
                    {bm.icon}
                  </div>
                  <span className="text-gray-600 text-[10px] mt-1 text-center truncate w-14">{bm.name}</span>
                </div>
              ))}
            </div>

            <h2 className="text-gray-800 font-semibold mb-3">Часто посещаемые</h2>
            <div className="space-y-3">
              {favorites.map((fav, i) => (
                <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="text-blue-600 text-sm font-medium">{fav.title}</div>
                  <div className="text-gray-400 text-xs">{fav.url}</div>
                  <div className="text-gray-500 text-xs mt-1">{fav.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentPage === 'page' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🍎</div>
              <h2 className="text-gray-800 text-lg font-bold">{url}</h2>
            </div>
            <div className="text-gray-600 text-sm space-y-3">
              <p>Добро пожаловать на {url}!</p>
              <p>Это демонстрационная страница браузера Safari.</p>
              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="text-gray-500 text-xs">🔒 Защищённое соединение</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'search' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-3">Результаты поиска: "{url}"</h3>
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="text-blue-600 text-sm">{url}/result-{i}</div>
                <div className="text-gray-800 font-medium text-sm mt-1">Результат #{i} для "{url}"</div>
                <div className="text-gray-500 text-xs mt-1">Описание результата поиска...</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-4 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-2 flex justify-around">
        <button onClick={() => setCurrentPage('home')} className="text-blue-500 text-lg">🏠</button>
        <button className="text-blue-500 text-lg">←</button>
        <button className="text-blue-500 text-lg">→</button>
        <button className="text-blue-500 text-lg">📑</button>
        <button className="text-blue-500 text-lg">⬆️</button>
      </div>
    </div>
  );
};

export default SafariApp;
