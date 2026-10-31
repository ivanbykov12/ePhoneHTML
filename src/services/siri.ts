// ===== Siri-подобный голосовой ассистент =====

export type SiriAction =
  | { type: 'openApp'; appId?: string; query: string }
  | { type: 'closeApp' }
  | { type: 'lock' }
  | { type: 'torchOn' }
  | { type: 'torchOff' }
  | { type: 'volumeUp' }
  | { type: 'volumeDown' }
  | { type: 'darkModeOn' }
  | { type: 'darkModeOff' }
  | { type: 'brightness'; value: number }
  | { type: 'weather'; city: string }
  | { type: 'time' }
  | { type: 'date' }
  | { type: 'joke' }
  | { type: 'flipCoin' }
  | { type: 'rollDice' }
  | { type: 'calculate'; expression: string; result?: number }
  | { type: 'whoAreYou' }
  | { type: 'unknown'; query: string };

const normalize = (s: string) =>
  s.toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z0-9\s+\-*/.,]/g, ' ').replace(/\s+/g, ' ').trim();

// Парсит выражение вида "сколько будет 2 плюс 2"
export function parseMathQuery(raw: string): { expression: string; result?: number } | null {
  let s = normalize(raw);
  s = s
    .replace(/плюс|прибавить/g, '+')
    .replace(/минус|отнять|вычесть/g, '-')
    .replace(/умножить/g, '*')
    .replace(/разделить|поделить|делить/g, '/')
    .replace(/,(\d)/g, '.$1')
    .replace(/[^0-9+\-*/.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const m = s.match(/^(-?\d+\.?\d*)\s*([+\-*/])\s*(-?\d+\.?\d*)$/);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const b = parseFloat(m[3]);
  let result: number | undefined;
  switch (m[2]) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b !== 0 ? a / b : undefined; break;
  }
  return { expression: `${m[1]} ${m[2]} ${m[3]}`, result };
}

const JOKES = [
  'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25 🎃',
  'Сколько программистов нужно, чтобы вкрутить лампочку? Ни одного — это аппаратная проблема 😄',
  'В мире есть 10 типов людей: те, кто понимает двоичную систему, и те, кто нет 😉',
  'Заходит как-то SQL-запрос в бар, подходит к двум столам и спрашивает: JOIN?',
  'Мой код не багнутый, он просто случайно работает идеально 🎲',
  'Что сказал один бит другому биту? «Ты в нуле или в единице?» 🤖',
];

export function interpretCommand(text: string, appNames: { id: string; name: string }[]): SiriAction {
  const raw = text.trim();
  const s = normalize(text);
  if (!s) return { type: 'unknown', query: raw };

  // Математика
  if (/сколько будет|вычисли|посчитай|калькуля/.test(s)) {
    const parsed = parseMathQuery(s.replace(/сколько будет|вычисли|посчитай/g, ''));
    if (parsed) return { type: 'calculate', ...parsed };
  }

  // Закрыть / назад
  if (/^(закрой|закрыть|выйти|выход|домой|назад|сверни)( |$)/.test(s)) return { type: 'closeApp' };

  // Блокировка
  if (/заблокируй|заблокировать|выключи экран|спящий режим|уложи телефон/.test(s)) return { type: 'lock' };

  // Фонарик
  if (/включи фонарик|фонарик включ|свет включ/.test(s)) return { type: 'torchOn' };
  if (/выключи фонарик|фонарик выкл/.test(s)) return { type: 'torchOff' };

  // Тема
  if (/тёмная тема|темная тема|темный режим|dark mode/.test(s)) return { type: 'darkModeOn' };
  if (/светлая тема|светлый режим|дневной режим/.test(s)) return { type: 'darkModeOff' };

  // Громкость
  if (/громче|увеличь громкость|голос побольше/.test(s)) return { type: 'volumeUp' };
  if (/тише|уменьши громкость|голос поменьше/.test(s)) return { type: 'volumeDown' };

  // Яркость
  const brightMatch = s.match(/яркост\w* (\d{2,3})/);
  if (brightMatch) return { type: 'brightness', value: Math.min(100, Math.max(30, parseInt(brightMatch[1]))) };
  if (/максимальная яркость|ярче всего|яркость максимум/.test(s)) return { type: 'brightness', value: 100 };
  if (/потемнее|яркость минимум/.test(s)) return { type: 'brightness', value: 40 };

  // Погода
  const weatherCities: Record<string, string> = {
    москве: 'Москва', спб: 'Санкт-Петербург', питер: 'Санкт-Петербург',
    лондоне: 'Лондон', токио: 'Токио', дубаи: 'Дубай',
  };
  if (/погод/.test(s)) {
    let city = '';
    for (const [key, val] of Object.entries(weatherCities)) {
      if (s.includes(key)) { city = val; break; }
    }
    return { type: 'weather', city };
  }

  // Время / дата
  if (/который час|сколько времени|какое время/.test(s)) return { type: 'time' };
  if (/какое сегодня число|какой сегодня день|какая дата/.test(s)) return { type: 'date' };

  // Развлечения
  if (/шутк|анекдот|рассмеши|пошути/.test(s)) return { type: 'joke' };
  if (/подбрось|монетк|орел|решк/.test(s)) return { type: 'flipCoin' };
  if (/кости|кубик|игральн/.test(s)) return { type: 'rollDice' };

  if (/кто ты|что ты умеешь|помощь|как тебя зовут/.test(s)) return { type: 'whoAreYou' };

  // Открытие приложения — самое длинное совпадение названия
  let best: { id: string; len: number } | null = null;
  for (const app of appNames) {
    const n = normalize(app.name);
    if (n.length >= 3 && s.includes(n)) {
      if (!best || n.length > best.len) best = { id: app.id, len: n.length };
    }
  }
  if (best && /открой|запусти|включи|перейди|начни/.test(s)) {
    return { type: 'openApp', appId: best.id, query: raw };
  }

  return { type: 'unknown', query: raw };
}

export function getJoke(): string {
  return JOKES[Math.floor(Math.random() * JOKES.length)];
}

export const SIRI_SUGGESTIONS = [
  'Открой Погоду',
  'Сколько будет 7 на 8?',
  'Включи фонарик',
  'Который час?',
  'Расскажи шутку',
  'Тёмная тема',
  'Подбрось монетку',
  'Заблокируй экран',
];
