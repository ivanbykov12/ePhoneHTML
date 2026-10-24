import React, { useState, useRef, useEffect } from 'react';

const songs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', color: 'from-red-500 to-pink-600' },
  { id: 2, title: 'Shape of You', artist: 'Ed Sheeran', duration: '3:53', color: 'from-green-500 to-emerald-600' },
  { id: 3, title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', color: 'from-purple-500 to-indigo-600' },
  { id: 4, title: 'Stay', artist: 'The Kid LAROI', duration: '2:21', color: 'from-blue-500 to-cyan-600' },
  { id: 5, title: 'Heat Waves', artist: 'Glass Animals', duration: '3:58', color: 'from-orange-500 to-red-600' },
  { id: 6, title: 'Bad Guy', artist: 'Billie Eilish', duration: '3:14', color: 'from-yellow-500 to-amber-600' },
  { id: 7, title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54', color: 'from-pink-500 to-rose-600' },
  { id: 8, title: 'Peaches', artist: 'Justin Bieber', duration: '3:18', color: 'from-teal-500 to-green-600' },
];

const MusicApp: React.FC = () => {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) { nextSong(); return 0; }
          return p + 0.5;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const nextSong = () => {
    const idx = songs.findIndex(s => s.id === currentSong.id);
    setCurrentSong(songs[(idx + 1) % songs.length]);
    setProgress(0);
  };

  const prevSong = () => {
    const idx = songs.findIndex(s => s.id === currentSong.id);
    setCurrentSong(songs[(idx - 1 + songs.length) % songs.length]);
    setProgress(0);
  };

  if (showPlayer) {
    return (
      <div className={`w-full h-full bg-gradient-to-b ${currentSong.color} flex flex-col items-center px-6`}>
        <button onClick={() => setShowPlayer(false)} className="self-start text-white/70 text-sm mb-8">↓ Свернуть</button>
        
        <div className={`w-56 h-56 rounded-2xl bg-gradient-to-br ${currentSong.color} shadow-2xl flex items-center justify-center text-7xl mb-8 border border-white/20`}>
          🎵
        </div>

        <div className="w-full text-center mb-6">
          <div className="text-white text-xl font-bold">{currentSong.title}</div>
          <div className="text-white/70">{currentSong.artist}</div>
        </div>

        {/* Progress */}
        <div className="w-full mb-6">
          <div className="w-full h-1 bg-white/20 rounded-full">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-white/50 text-xs mt-1">
            <span>{Math.floor(progress * 0.032)}:{String(Math.floor((progress * 1.92) % 60)).padStart(2, '0')}</span>
            <span>{currentSong.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={prevSong} className="text-white text-2xl">⏮</button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <button onClick={nextSong} className="text-white text-2xl">⏭</button>
        </div>

        {/* Volume */}
        <div className="w-full mt-8 flex items-center gap-3">
          <span className="text-white/50 text-sm">🔈</span>
          <input type="range" min="0" max="100" defaultValue="70" className="flex-1 accent-white" />
          <span className="text-white/50 text-sm">🔊</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold">🎵 Музыка</h1>
      </div>

      {/* Mini Player */}
      <div
        onClick={() => setShowPlayer(true)}
        className="mx-4 mb-4 bg-gray-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSong.color} flex items-center justify-center text-lg`}>
          🎵
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{currentSong.title}</div>
          <div className="text-gray-400 text-xs">{currentSong.artist}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          className="text-white text-xl"
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
      </div>

      {/* Song List */}
      <div className="px-4">
        <h2 className="text-white font-semibold mb-3">Медиатека</h2>
        <div className="space-y-2">
          {songs.map(song => (
            <div
              key={song.id}
              onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${
                currentSong.id === song.id ? 'bg-white/10' : 'active:bg-white/5'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${song.color} flex items-center justify-center text-sm`}>
                🎵
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${currentSong.id === song.id ? 'text-green-400' : 'text-white'}`}>
                  {song.title}
                </div>
                <div className="text-gray-400 text-xs">{song.artist}</div>
              </div>
              <span className="text-gray-500 text-xs">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicApp;
