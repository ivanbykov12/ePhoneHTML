import React, { useState, useEffect } from 'react';

const HealthApp: React.FC = () => {
  const [steps, setSteps] = useState(7842);
  const [heartRate, setHeartRate] = useState(72);
  const [calories, setCalories] = useState(456);
  const [sleep, setSleep] = useState(7.5);
  const [water, setWater] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(68 + Math.floor(Math.random() * 10));
      setSteps(s => s + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const weekData = [65, 80, 45, 90, 70, 85, 60];
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="w-full h-full bg-black overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold">❤️ Здоровье</h1>
      </div>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4">
          <div className="text-white/70 text-xs">👟 Шаги</div>
          <div className="text-white text-2xl font-bold">{steps.toLocaleString()}</div>
          <div className="text-white/60 text-xs">цель: 10,000</div>
          <div className="mt-2 h-1.5 bg-white/20 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl p-4">
          <div className="text-white/70 text-xs">❤️ Пульс</div>
          <div className="text-white text-2xl font-bold">{heartRate} <span className="text-sm">уд/м</span></div>
          <div className="text-white/60 text-xs">в покое</div>
          <div className="mt-2 flex gap-0.5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-1 bg-white/60 rounded-full" style={{ height: `${8 + Math.random() * 16}px` }} />
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4">
          <div className="text-white/70 text-xs">🔥 Калории</div>
          <div className="text-white text-2xl font-bold">{calories}</div>
          <div className="text-white/60 text-xs">ккал сожжено</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4">
          <div className="text-white/70 text-xs">😴 Сон</div>
          <div className="text-white text-2xl font-bold">{sleep}ч</div>
          <div className="text-white/60 text-xs">прошлая ночь</div>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="px-4 mb-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm font-medium">💧 Вода</span>
            <span className="text-blue-400 text-sm">{water}/8 стаканов</span>
          </div>
          <div className="flex gap-2 mb-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                onClick={() => setWater(i + 1)}
                className={`flex-1 h-8 rounded-lg cursor-pointer transition-colors ${
                  i < water ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-400 text-xs">Нажми на стакан чтобы отметить</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="px-4 mb-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="text-white text-sm font-medium mb-3">📊 Активность за неделю</div>
          <div className="flex items-end gap-2 h-24">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md"
                  style={{ height: `${val}%` }}
                />
                <span className="text-gray-400 text-[10px] mt-1">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="px-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="text-white text-sm font-medium mb-2">💡 Совет дня</div>
          <div className="text-gray-300 text-sm">
            Пройдите ещё 2,158 шагов чтобы достичь дневной цели. Отличная работа! 🎉
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthApp;
