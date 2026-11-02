// ===== XWeather API-клиент =====
// Ключ берётся из .env: VITE_XWEATHER_API_KEY (файл в .gitignore, не коммитится)
const API_KEY = (import.meta as any).env?.VITE_XWEATHER_API_KEY || '';

export interface WeatherInfo {
  temp: number;
  desc: string;
  icon: string;
  city: string;
}

// Маппинг weather code -> описание + эмодзи (по кодам XWeather/OpenWeather)
const CODE_MAP: Record<number, [string, string]> = {
  800: ['Ясно', '☀️'],
  801: ['Малооблачно', '🌤️'],
  802: ['Переменная облачность', '⛅'],
  803: ['Облачно', '☁️'],
  804: ['Пасмурно', '☁️'],
  900: ['Гроза', '⛈️'],
  901: ['Тропический шторм', '🌀'],
  903: ['Метель', '❄️'],
  905: ['Туман', '🌫️'],
  906: ['Град', '🌨️'],
  500: ['Небольшой дождь', '🌦️'],
  501: ['Дождь', '🌧️'],
  502: ['Ливень', '🌧️'],
  520: ['Кратковременный дождь', '🌦️'],
  600: ['Небольшой снег', '🌨️'],
  601: ['Снег', '🌨️'],
  602: ['Сильный снег', '❄️'],
};

const describe = (code: number): [string, string] => {
  if (code == null || Number.isNaN(code)) return ['Облачно', '🌥️'];
  if (CODE_MAP[code]) return CODE_MAP[code];
  if (code >= 200 && code < 300) return ['Гроза', '⛈️'];
  if (code >= 300 && code < 400) return ['Изморось', '🌦️'];
  if (code >= 500 && code < 600) return ['Дождь', '🌧️'];
  if (code >= 600 && code < 700) return ['Снег', '🌨️'];
  if (code >= 700 && code < 800) return ['Туман', '🌫️'];
  return ['Облачно', '🌥️'];
};

const pick = (obj: any, keys: string[]): any => {
  for (const k of keys) {
    const v = k.split('.').reduce((o: any, p) => (o == null ? undefined : o[p]), obj);
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
};

// Парсинг ответа в формате OpenWeather/XWeather (weather-массив + main.temp)
const parseOwm = (d: any, city: string): WeatherInfo | null => {
  const rawTemp = pick(d, ['main.temp', 'current.temp', 'temp', 'main.feels_like']);
  if (rawTemp === undefined || Number.isNaN(Number(rawTemp))) return null;
  const code = Number(pick(d, ['weather[0].id', 'current.weather_code', 'weather.code', 'conditions.id']));
  const manualDesc = pick(d, ['weather[0].description', 'current.description', 'conditions.text']);
  let desc: string, icon: string;
  if (manualDesc) {
    const pair = describe(code);
    desc = String(manualDesc);
    icon = pair[1];
  } else {
    [desc, icon] = describe(code);
  }
  return { temp: Math.round(Number(rawTemp)), desc, icon, city };
};

// Основной запрос к XWeather. Порядок источников:
// 1) api.xweather.com (основной хост сервиса)
// 2) api.openweathermap.org (XWeather использует совместимый формат ответа)
// 3) Open-Meteo (без ключа) — последний резерв, чтобы виджет никогда не зависал
//    на «Загрузка погоды…».
// Город по умолчанию — Нижний Новгород (координаты 56.32/43.97)
export const DEFAULT_CITY = 'Нижний Новгород';
export const DEFAULT_LAT = 56.32;
export const DEFAULT_LON = 43.97;

export async function fetchXWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON, city = DEFAULT_CITY): Promise<WeatherInfo | null> {
  const owmPaths = ['/data/2.5/weather', '/data/3.0/weather'];
  const hosts = API_KEY ? ['https://api.xweather.com', 'https://api.openweathermap.org'] : [];
  for (const host of hosts) {
    for (const path of owmPaths) {
      const url = `${host}${path}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      try {
        const r = await fetch(url);
        if (!r.ok) continue;
        const d = await r.json();
        const w = parseOwm(d, city);
        if (w) return w;
      } catch {
        // пробуем следующий вариант URL
      }
    }
  }
  // Резервный источник без ключа
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
    if (r.ok) {
      const d = await r.json();
      const t = d?.current?.temperature_2m;
      if (t !== undefined && t !== null) {
        const [desc, icon] = describe(Number(d?.current?.weather_code));
        return { temp: Math.round(Number(t)), desc, icon, city };
      }
    }
  } catch {
    // сети нет — вернём null, вызывающий код покажет демо-данные
  }
  return null;
}

// Совместимость со старыми вызовами
export const fetchFallbackWeather = (lat = DEFAULT_LAT, lon = DEFAULT_LON, city = DEFAULT_CITY) => fetchXWeather(lat, lon, city);

export const hasXWeatherKey = () => Boolean(API_KEY);
