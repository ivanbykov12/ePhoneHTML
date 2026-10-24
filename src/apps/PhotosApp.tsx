import React, { useState } from 'react';

const photos = [
  { id: 1, color: 'from-red-400 to-pink-500', emoji: '🌅', label: 'Закат' },
  { id: 2, color: 'from-green-400 to-emerald-500', emoji: '🌲', label: 'Лес' },
  { id: 3, color: 'from-blue-400 to-cyan-500', emoji: '🏖', label: 'Пляж' },
  { id: 4, color: 'from-purple-400 to-indigo-500', emoji: '🌃', label: 'Город' },
  { id: 5, color: 'from-yellow-400 to-orange-500', emoji: '🌻', label: 'Цветы' },
  { id: 6, color: 'from-pink-400 to-rose-500', emoji: '🐱', label: 'Котик' },
  { id: 7, color: 'from-teal-400 to-green-500', emoji: '🏔', label: 'Горы' },
  { id: 8, color: 'from-orange-400 to-red-500', emoji: '🍂', label: 'Осень' },
  { id: 9, color: 'from-cyan-400 to-blue-500', emoji: '🌊', label: 'Океан' },
  { id: 10, color: 'from-violet-400 to-purple-500', emoji: '🦋', label: 'Бабочка' },
  { id: 11, color: 'from-amber-400 to-yellow-500', emoji: '🌞', label: 'Солнце' },
  { id: 12, color: 'from-emerald-400 to-teal-500', emoji: '🍀', label: 'Удача' },
];

const PhotosApp: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 3, 6]));

  const toggleFav = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (selected !== null) {
    const photo = photos.find(p => p.id === selected);
    if (!photo) return null;
    return (
      <div className="w-full h-full bg-black pt-16 flex flex-col items-center">
        <div className="flex justify-between w-full px-4 mb-4">
          <button onClick={() => setSelected(null)} className="text-blue-400 text-sm">← Назад</button>
          <button onClick={() => toggleFav(photo.id)} className="text-xl">
            {favorites.has(photo.id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div className={`w-72 h-72 rounded-2xl bg-gradient-to-br ${photo.color} flex items-center justify-center text-8xl shadow-2xl`}>
          {photo.emoji}
        </div>
        <div className="text-white text-lg mt-4">{photo.label}</div>
        <div className="text-gray-400 text-sm mt-1">iPhone 15 Pro • Сегодня</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black pt-16 overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold">Фото</h1>
        <p className="text-gray-400 text-sm">{photos.length} фото</p>
      </div>
      <div className="px-2 grid grid-cols-3 gap-1">
        {photos.map(photo => (
          <div
            key={photo.id}
            onClick={() => setSelected(photo.id)}
            className={`aspect-square rounded-lg bg-gradient-to-br ${photo.color} flex items-center justify-center text-3xl cursor-pointer active:scale-95 transition-transform relative`}
          >
            {photo.emoji}
            {favorites.has(photo.id) && (
              <span className="absolute bottom-1 right-1 text-xs">❤️</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosApp;
