import React, { useState } from 'react';

const MapsApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const places = [
    { name: 'Красная площадь', type: 'Достопримечательность', distance: '2.3 км', emoji: '🏛', rating: 4.9 },
    { name: 'Парк Горького', type: 'Парк', distance: '4.1 км', emoji: '🌳', rating: 4.7 },
    { name: 'ТЦ Авиапарк', type: 'Торговый центр', distance: '5.8 км', emoji: '🛍', rating: 4.3 },
    { name: 'Кафе Пушкин', type: 'Ресторан', distance: '1.2 км', emoji: '🍽', rating: 4.8 },
    { name: 'Москва-Сити', type: 'Бизнес-центр', distance: '7.5 км', emoji: '🏢', rating: 4.6 },
    { name: 'ВДНХ', type: 'Выставка', distance: '8.2 км', emoji: '🎪', rating: 4.5 },
  ];

  return (
    <div className="w-full h-full bg-gray-900 pt-16 flex flex-col">
      {/* Search */}
      <div className="px-4 mb-3">
        <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск мест"
            className="bg-transparent text-white text-sm flex-1 outline-none"
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-teal-900 mb-4">
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
        
        {/* Roads */}
        <div className="absolute top-1/3 left-0 right-0 h-2 bg-yellow-600/40" />
        <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-yellow-600/40" />
        <div className="absolute top-1/4 left-1/4 w-32 h-1.5 bg-gray-400/30 rotate-45" />
        
        {/* User location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute -top-4 -left-4" />
        </div>

        {/* Place markers */}
        {places.slice(0, 4).map((place, i) => (
          <div
            key={i}
            className="absolute cursor-pointer"
            style={{
              top: `${20 + i * 18}%`,
              left: `${15 + i * 20}%`,
            }}
            onClick={() => setSelectedPlace(place.name)}
          >
            <div className="text-2xl drop-shadow-lg">{place.emoji}</div>
          </div>
        ))}

        {/* Compass */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">
          N
        </div>
      </div>

      {/* Places List */}
      <div className="px-4 overflow-y-auto pb-20">
        {selectedPlace && (
          <div className="bg-gray-800 rounded-xl p-3 mb-3 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">{selectedPlace}</div>
              <div className="text-gray-400 text-xs">Нажмите для маршрута</div>
            </div>
            <button onClick={() => setSelectedPlace(null)} className="text-blue-400 text-sm">Маршрут →</button>
          </div>
        )}
        {places.map((place, i) => (
          <div
            key={i}
            onClick={() => setSelectedPlace(place.name)}
            className="flex items-center gap-3 py-2 border-b border-gray-800 cursor-pointer active:bg-gray-800 rounded-lg px-2"
          >
            <span className="text-xl">{place.emoji}</span>
            <div className="flex-1">
              <div className="text-white text-sm">{place.name}</div>
              <div className="text-gray-400 text-xs">{place.type} • {place.distance} • ★ {place.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapsApp;
