import React, { useState } from 'react';

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('Москва');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const weatherData = {
    'Москва': { temp: 18, condition: 'Облачно', icon: '⛅', humidity: 65, wind: 12, forecast: [15, 17, 19, 21, 18, 16, 14] },
    'Нью-Йорк': { temp: 24, condition: 'Солнечно', icon: '☀️', humidity: 45, wind: 8, forecast: [22, 25, 27, 26, 24, 23, 21] },
    'Лондон': { temp: 14, condition: 'Дождь', icon: '🌧', humidity: 80, wind: 18, forecast: [12, 13, 15, 14, 13, 11, 10] },
    'Токио': { temp: 28, condition: 'Ясно', icon: '🌤', humidity: 55, wind: 6, forecast: [26, 29, 30, 28, 27, 25, 24] },
    'Дубай': { temp: 38, condition: 'Жарко', icon: '☀️', humidity: 25, wind: 15, forecast: [36, 39, 40, 38, 37, 35, 34] },
  };

  const data = weatherData[city as keyof typeof weatherData] || weatherData['Москва'];
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const temp = unit === 'C' ? data.temp : Math.round(data.temp * 9/5 + 32);

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-600 to-blue-900 px-4 overflow-y-auto pb-20">
      <div className="text-center mb-6">
        <h1 className="text-white text-2xl font-light">{city}</h1>
        <div className="text-white text-6xl font-thin my-2">{temp}°{unit}</div>
        <div className="text-white/70 text-lg">{data.condition}</div>
        <div className="text-white/50 text-sm">Макс: {data.temp + 3}° Мин: {data.temp - 4}°</div>
      </div>

      {/* City Selector */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {Object.keys(weatherData).map(c => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              city === c ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Hourly */}
      <div className="glass-effect rounded-2xl p-4 mb-4">
        <div className="text-white/70 text-xs mb-3">Почасовой прогноз</div>
        <div className="flex gap-4 overflow-x-auto">
          {['Сейчас', '13:00', '14:00', '15:00', '16:00', '17:00'].map((h, i) => (
            <div key={i} className="flex flex-col items-center min-w-[40px]">
              <span className="text-white/70 text-xs">{h}</span>
              <span className="text-lg my-1">{i % 2 === 0 ? '⛅' : '☀️'}</span>
              <span className="text-white text-sm font-medium">{data.forecast[i] || data.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly */}
      <div className="glass-effect rounded-2xl p-4 mb-4">
        <div className="text-white/70 text-xs mb-3">Прогноз на 7 дней</div>
        {days.map((day, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
            <span className="text-white text-sm w-8">{day}</span>
            <span className="text-lg">{['⛅', '☀️', '🌧', '⛅', '☀️', '🌤', '⛅'][i]}</span>
            <div className="flex-1 mx-3">
              <div className="h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" style={{ width: `${50 + i * 5}%` }} />
            </div>
            <span className="text-white text-sm">{data.forecast[i]}°</span>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-effect rounded-2xl p-3">
          <div className="text-white/50 text-xs">💨 Ветер</div>
          <div className="text-white text-xl font-light">{data.wind} км/ч</div>
        </div>
        <div className="glass-effect rounded-2xl p-3">
          <div className="text-white/50 text-xs">💧 Влажность</div>
          <div className="text-white text-xl font-light">{data.humidity}%</div>
        </div>
      </div>

      {/* Unit Toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className="px-4 py-2 glass-effect rounded-full text-white text-sm"
        >
          °{unit === 'C' ? 'C' : 'F'} → °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>
    </div>
  );
};

export default WeatherApp;
