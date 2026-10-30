import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

// ===== Погодный виджет с реальными данными Open-Meteo =====
const CITIES: Record<string, { lat: number; lon: number }> = {
  Москва: { lat: 55.7558, lon: 37.6173 },
  'Санкт-Петербург': { lat: 59.9343, lon: 30.3351 },
};

function weatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '🌤️' : '🌙';
  if (code === 3) return '☁️';
  if (code < 50) return '🌫️';
  if (code < 70) return '🌧️';
  if (code < 80) return '🌨️';
  if (code < 95) return '⛈️';
  return '⛈️';
}

const WeatherWidget: React.FC<{ large?: boolean }> = ({ large }) => {
  const [data, setData] = useState<{ temp: number; desc: string; emoji: string; city: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const city = localStorage.getItem('ephone_weather_city') || 'Москва';
        const c = CITIES[city] || CITIES['Москва'];
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code,is_day&timezone=auto`
        );
        const j = await res.json();
        if (cancelled || !j.current) return;
        const code = j.current.weather_code as number;
        const isDay = j.current.is_day === 1;
        const descs: Record<number, string> = {
          0: 'Ясно', 1: 'Переменная облачность', 2: 'Облачно с прояснениями', 3: 'Пасмурно',
          45: 'Туман', 48: 'Изморозь', 51: 'Морось', 61: 'Дождь', 63: 'Дождь', 65: 'Ливень',
          71: 'Снег', 73: 'Снег', 75: 'Снегопад', 80: 'Ливни', 95: 'Гроза',
        };
        setData({
          temp: Math.round(j.current.temperature_2m),
          desc: descs[code] || 'Погода',
          emoji: weatherEmoji(code, isDay),
          city,
        });
      } catch {
        if (!cancelled) setData({ temp: 12, desc: 'Нет сети', emoji: '🌡️', city: 'Москва' });
      }
    };
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return (
    <div className={`glass rounded-[22px] p-3.5 text-white w-full h-full flex flex-col justify-between ${large ? '' : ''}`}>
      {data ? (
        <>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold opacity-80">{data.city}</div>
              <div className="text-3xl font-extralight leading-none mt-0.5">{data.temp}°</div>
            </div>
            <div className="text-3xl">{data.emoji}</div>
          </div>
          <div className="text-[10px] opacity-70 truncate">{data.desc}</div>
        </>
      ) : (
        <div className="shimmer w-full h-full rounded-xl min-h-[60px]" />
      )}
    </div>
  );
}

// ===== Часы =====
const ClockWidget: React.FC = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="glass rounded-[22px] p-3.5 text-white w-full h-full flex flex-col items-center justify-center">
      <div className="text-2xl font-light tabular-nums leading-none">
        {now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-[10px] opacity-70 mt-1 capitalize">
        {now.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
      </div>
    </div>
  );
};

// ===== Календарь (реальные данные) =====
const CalendarWidget: React.FC = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div className="glass rounded-[22px] p-3 text-white w-full h-full flex flex-col">
      <div className="text-[10px] font-bold uppercase tracking-wide text-red-400 mb-1">
        {now.toLocaleDateString('ru-RU', { month: 'long' })}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[8px] flex-1 content-start">
        {['п', 'в', 'с', 'ч', 'пт', 'с', 'в'].map((d, i) => (
          <div key={i} className="text-white/40 font-bold">{d}</div>
        ))}
        {cells.map((c, i) => (
          <div key={i} className={c === now.getDate() ? 'bg-red-500 rounded-full font-bold text-white' : c ? 'text-white/80' : ''}>
            {c ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Уведомления =====
const NotifWidget: React.FC = () => {
  const { notifications } = useNotifications();
  const last = notifications.slice(0, 2);
  return (
    <div className="glass rounded-[22px] p-3 text-white w-full h-full flex flex-col overflow-hidden">
      <div className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-1.5 flex items-center justify-between">
        Уведомления
        {notifications.length > 0 && (
          <span className="bg-red-500 rounded-full px-1.5 text-[8px] font-bold">{notifications.length}</span>
        )}
      </div>
      {last.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[10px] opacity-40">Чисто ✨</div>
      ) : (
        <div className="space-y-1.5 overflow-hidden">
          {last.map(n => (
            <div key={n.id} className="flex items-center gap-1.5 animate-fade-in">
              <span className="text-sm">{n.icon.startsWith('material:') ? '🔔' : n.icon}</span>
              <div className="min-w-0">
                <div className="text-[9px] font-semibold truncate">{n.title}</div>
                <div className="text-[8px] opacity-60 truncate">{n.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Быстрые действия =====
const ActionsWidget: React.FC = () => (
  <div className="glass rounded-[22px] p-3 text-white w-full h-full grid grid-cols-4 place-items-center">
    {[
      { e: '🔦', l: 'Фонарик' },
      { e: '🧮', l: 'Кальк.' },
      { e: '⏱', l: 'Таймер' },
      { e: '🎵', l: 'Музыка' },
    ].map((a, i) => (
      <button key={i} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        onClick={() => window.dispatchEvent(new CustomEvent('widgetAction', { detail: a.l }))}>
        <span className="text-lg">{a.e}</span>
        <span className="text-[7px] opacity-70">{a.l}</span>
      </button>
    ))}
  </div>
);

export type WidgetId = 'weather' | 'clock' | 'calendar' | 'notifications' | 'actions';

const WIDGET_DEFS: Record<WidgetId, { name: string; span: string; render: React.FC<{ large?: boolean }> }> = {
  weather: { name: 'Погода', span: 'col-span-2 row-span-2', render: WeatherWidget },
  clock: { name: 'Часы', span: 'col-span-2 row-span-1', render: ClockWidget },
  calendar: { name: 'Календарь', span: 'col-span-2 row-span-2', render: CalendarWidget },
  notifications: { name: 'Уведомления', span: 'col-span-2 row-span-2', render: NotifWidget },
  actions: { name: 'Действия', span: 'col-span-2 row-span-1', render: ActionsWidget },
};

interface WidgetsRowProps {
  onOpenApp: (id: string) => void;
}

const WidgetsRow: React.FC<WidgetsRowProps> = ({ onOpenApp }) => {
  const [enabled, setEnabled] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('ephone_widgets');
      return saved ? JSON.parse(saved) : ['weather', 'clock'];
    } catch { return ['weather', 'clock']; }
  });
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    localStorage.setItem('ephone_widgets', JSON.stringify(enabled));
  }, [enabled]);

  if (enabled.length === 0 && !showPicker) {
    return (
      <div className="mx-1 mb-3">
        <button onClick={() => setShowPicker(true)}
          className="w-full glass rounded-[22px] py-2.5 text-white/60 text-xs font-medium active:scale-95 transition-transform">
          ＋ Добавить виджеты
        </button>
        {showPicker && <Picker enabled={enabled} setEnabled={setEnabled} onClose={() => setShowPicker(false)} />}
      </div>
    );
  }

  return (
    <div className="mx-1 mb-3 relative">
      <div className="grid grid-flow-col auto-cols-[110px] gap-3 overflow-x-auto pb-1">
        <AnimatePresence>
          {enabled.map(id => {
            const def = WIDGET_DEFS[id];
            const Comp = def.render;
            const h = def.span.includes('row-span-2') ? 'h-[110px]' : 'h-[52px]';
            return (
              <motion.div key={id} layout
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={`${h} cursor-pointer`}
                onClick={() => onOpenApp(id === 'weather' ? 'weather_system' : id === 'clock' ? 'clock_system' : id === 'calendar' ? 'clock_system' : id === 'notifications' ? 'messages_system' : 'settings_system')}>
                <Comp />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <motion.div layout className="h-[52px] self-center">
          <button onClick={() => setShowPicker(true)}
            className="w-[110px] h-[52px] rounded-[22px] border border-dashed border-white/30 text-white/50 text-xs active:scale-95 transition-transform">
            ＋ Виджеты
          </button>
        </motion.div>
      </div>
      {showPicker && <Picker enabled={enabled} setEnabled={setEnabled} onClose={() => setShowPicker(false)} />}
    </div>
  );
};

const Picker: React.FC<{
  enabled: WidgetId[];
  setEnabled: React.Dispatch<React.SetStateAction<WidgetId[]>>;
  onClose: () => void;
}> = ({ enabled, setEnabled, onClose }) => (
  <div className="absolute inset-0 z-50" onClick={onClose}>
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="glass-dark rounded-3xl p-4 mx-auto max-w-[280px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px]"
      onClick={e => e.stopPropagation()}>
      <div className="text-white text-sm font-bold mb-3">Виджеты</div>
      <div className="space-y-2">
        {(Object.keys(WIDGET_DEFS) as WidgetId[]).map(id => {
          const on = enabled.includes(id);
          return (
            <button key={id}
              onClick={() => setEnabled(prev => on ? prev.filter(w => w !== id) : [...prev, id])}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all active:scale-95 ${
                on ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/70'}`}>
              <span>{WIDGET_DEFS[id].name}</span>
              <span>{on ? '✓' : '＋'}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onClose} className="w-full mt-3 py-2 text-white/50 text-xs">Готово</button>
    </motion.div>
  </div>
);

export default WidgetsRow;
