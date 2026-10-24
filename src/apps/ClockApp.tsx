import React, { useState, useEffect } from 'react';

const ClockApp: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [tab, setTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('world');
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [alarms, setAlarms] = useState([
    { time: '07:00', label: 'Подъём', enabled: true },
    { time: '08:30', label: 'Работа', enabled: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stopwatchRunning) {
      const interval = setInterval(() => setStopwatchTime(t => t + 10), 10);
      return () => clearInterval(interval);
    }
  }, [stopwatchRunning]);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      const interval = setInterval(() => setTimerSeconds(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timerSeconds === 0) setTimerRunning(false);
  }, [timerRunning, timerSeconds]);

  const formatStopwatch = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centisec = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(centisec).padStart(2, '0')}`;
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-black pt-2 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-2">
        {(['world', 'alarm', 'stopwatch', 'timer'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-medium ${tab === t ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500'}`}
          >
            {t === 'world' ? '🌍 Мир' : t === 'alarm' ? '⏰ Будильник' : t === 'stopwatch' ? '⏱ Секундомер' : '⏳ Таймер'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'world' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl text-white font-thin mb-4">
              {time.toLocaleTimeString('ru-RU')}
            </div>
            <div className="text-gray-400 text-lg">
              {time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              {[
                { city: 'Москва', offset: 3 },
                { city: 'Нью-Йорк', offset: -5 },
                { city: 'Токио', offset: 9 },
                { city: 'Лондон', offset: 0 },
              ].map(({ city, offset }) => {
                const utc = time.getTime() + time.getTimezoneOffset() * 60000;
                const cityTime = new Date(utc + offset * 3600000);
                return (
                  <div key={city} className="bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-gray-400 text-xs">{city}</div>
                    <div className="text-white text-xl font-light">
                      {cityTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'alarm' && (
          <div className="space-y-3">
            {alarms.map((alarm, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white text-2xl font-light">{alarm.time}</div>
                  <div className="text-gray-400 text-xs">{alarm.label}</div>
                </div>
                <button
                  onClick={() => setAlarms(prev => prev.map((a, idx) => idx === i ? { ...a, enabled: !a.enabled } : a))}
                  className={`w-12 h-7 rounded-full ${alarm.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
            <button className="w-full py-3 bg-orange-500 rounded-xl text-white font-bold">
              + Добавить будильник
            </button>
          </div>
        )}

        {tab === 'stopwatch' && (
          <div className="flex flex-col items-center">
            <div className="text-white text-5xl font-thin my-8">{formatStopwatch(stopwatchTime)}</div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (stopwatchRunning) { setLaps([...laps, stopwatchTime]); }
                  else { setStopwatchTime(0); setLaps([]); }
                }}
                className="w-20 h-20 rounded-full bg-gray-700 text-white text-sm font-medium"
              >
                {stopwatchRunning ? 'Круг' : 'Сброс'}
              </button>
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className={`w-20 h-20 rounded-full text-sm font-medium ${stopwatchRunning ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}
              >
                {stopwatchRunning ? 'Стоп' : 'Старт'}
              </button>
            </div>
            {laps.length > 0 && (
              <div className="mt-6 w-full space-y-2">
                {laps.map((lap, i) => (
                  <div key={i} className="flex justify-between text-gray-300 text-sm bg-gray-800 rounded-lg px-3 py-2">
                    <span>Круг {i + 1}</span>
                    <span>{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'timer' && (
          <div className="flex flex-col items-center">
            <div className={`text-6xl font-thin my-8 ${timerSeconds === 0 && !timerRunning ? 'text-red-400' : 'text-white'}`}>
              {formatTimer(timerSeconds)}
            </div>
            {!timerRunning && timerSeconds > 0 && (
              <div className="flex gap-2 mb-6">
                {[30, 60, 120, 300].map(s => (
                  <button key={s} onClick={() => setTimerSeconds(s)} className="px-3 py-1 bg-gray-700 rounded-full text-white text-xs">
                    {s < 60 ? `${s}с` : `${s / 60}м`}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => { setTimerRunning(false); setTimerSeconds(60); }}
                className="w-20 h-20 rounded-full bg-gray-700 text-white text-sm font-medium"
              >
                Сброс
              </button>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`w-20 h-20 rounded-full text-sm font-medium ${timerRunning ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}
              >
                {timerRunning ? 'Стоп' : 'Старт'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockApp;
