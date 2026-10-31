import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, MicOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { interpretCommand, getJoke, SIRI_SUGGESTIONS, SiriAction } from '../services/siri';

interface SiriAssistantProps {
  visible: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
  onLock: () => void;
  onCloseApp: () => void;
  onWeatherCity: (city: string) => void;
}

type Phase = 'idle' | 'listening' | 'processing' | 'result';

// ===== Web Speech API (распознавание речи) =====
const useSpeechRecognition = (onResult: (text: string) => void) => {
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.lang = 'ru-RU';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
      recRef.current = rec;
    }
    return () => { try { recRef.current?.abort(); } catch {} };
  }, []);

  const start = () => { try { recRef.current?.start(); } catch {} };
  const stop = () => { try { recRef.current?.stop(); } catch {} };
  return { supported, start, stop };
};

// Озвучка ответа
const speak = (text: string) => {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 1.05;
    speechSynthesis.speak(u);
  } catch {}
};

const SiriAssistant: React.FC<SiriAssistantProps> = ({
  visible, onClose, onOpenApp, onLock, onCloseApp, onWeatherCity,
}) => {
  const { customApps, settings, setSettings } = useAppContext();
  const [phase, setPhase] = useState<Phase>('idle');
  const [heard, setHeard] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (text: string) => {
    setHeard(text);
    setPhase('processing');
    const apps = customApps.map(a => ({ id: a.id, name: a.name }));
    const action: SiriAction = interpretCommand(text, apps);

    setTimeout(() => {
      let reply = '';
      switch (action.type) {
        case 'openApp':
          if (action.appId) {
            const app = customApps.find(a => a.id === action.appId);
            reply = `Открываю «${app?.name}»`;
            onOpenApp(action.appId);
            setTimeout(onClose, 600);
          } else reply = 'Не нашла такое приложение 🤔';
          break;
        case 'closeApp':
          reply = 'Хорошо, закрываю';
          onCloseApp();
          setTimeout(onClose, 500);
          break;
        case 'lock':
          reply = 'Блокирую экран';
          setTimeout(() => { onClose(); onLock(); }, 700);
          break;
        case 'torchOn':
          reply = 'Фонарик включён 🔦';
          window.dispatchEvent(new CustomEvent('siriTorch', { detail: true }));
          break;
        case 'torchOff':
          reply = 'Фонарик выключен';
          window.dispatchEvent(new CustomEvent('siriTorch', { detail: false }));
          break;
        case 'darkModeOn':
          reply = 'Включаю тёмную тему 🌙';
          setSettings(s => ({ ...s, darkMode: true }));
          break;
        case 'darkModeOff':
          reply = 'Включаю светлую тему ☀️';
          setSettings(s => ({ ...s, darkMode: false }));
          break;
        case 'volumeUp':
          reply = 'Громкость больше 🔊';
          window.dispatchEvent(new CustomEvent('siriVolume', { detail: 1 }));
          break;
        case 'volumeDown':
          reply = 'Громкость меньше 🔉';
          window.dispatchEvent(new CustomEvent('siriVolume', { detail: -1 }));
          break;
        case 'brightness':
          reply = `Яркость ${action.value}%`;
          setSettings(s => ({ ...s, brightness: action.value }));
          break;
        case 'weather':
          reply = action.city ? `Погода в городе ${action.city}` : 'Показываю погоду';
          onWeatherCity(action.city);
          onOpenApp('weather_system');
          setTimeout(onClose, 600);
          break;
        case 'time': {
          const t = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          reply = `Сейчас ${t} 🕐`;
          break;
        }
        case 'date':
          reply = `Сегодня ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 📅`;
          break;
        case 'joke':
          reply = getJoke();
          break;
        case 'flipCoin':
          reply = Math.random() < 0.5 ? 'Орёл! 🪙' : 'Решка! 🪙';
          break;
        case 'rollDice': {
          const d = 1 + Math.floor(Math.random() * 6);
          reply = `Выпало ${d} ${['⚀','⚁','⚂','⚃','⚄','⚅'][d - 1]}`;
          break;
        }
        case 'calculate':
          reply = action.result !== undefined
            ? `${action.expression} = ${Number(action.result.toFixed(4))} 🧮`
            : 'Не смогла посчитать 🤔';
          break;
        case 'whoAreYou':
          reply = 'Я — eSiri, голосовой ассистент ePhone. Умею открывать приложения, управлять настройками, отвечать на вопросы и считать. Попробуй: «Открой Погоду» 😊';
          break;
        default:
          reply = `Не поняла «${action.query}». Скажи, например, «Открой Змейку» или «Который час?»`;
      }
      setAnswer(reply);
      setPhase('result');
      speak(reply);
    }, 800);
  };

  const { supported, start, stop } = useSpeechRecognition(handleCommand);

  useEffect(() => {
    if (visible) {
      setPhase('listening');
      setAnswer('');
      setHeard('');
      if (supported) start();
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      stop();
      try { speechSynthesis.cancel(); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const startListening = () => {
    setPhase('listening');
    setAnswer('');
    if (supported) start();
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-[98] flex flex-col items-center justify-end"
          onClick={onClose}>
          {/* Dim backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          {/* Animated orb */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={e => e.stopPropagation()}>
            <motion.div
              className="w-28 h-28 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #ff2d55, #5e5ce6, #32ade6, #34c759, #ff9f0a, #ff2d55)',
                filter: 'blur(14px)',
              }}
              animate={{ rotate: phase === 'listening' ? 360 : 40, scale: phase === 'listening' ? [1, 1.15, 1] : 1 }}
              transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.8, repeat: phase === 'listening' ? Infinity : 0 } }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {phase === 'processing' ? (
                <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Mic className={`w-10 h-10 ${phase === 'listening' ? 'text-white' : 'text-white/70'}`} />
              )}
            </div>
          </motion.div>

          {/* Transcript / answer */}
          <div className="relative w-full px-6 pb-6 z-10" onClick={e => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {phase === 'result' ? (
                <motion.div key="answer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="glass-dark rounded-3xl p-4 mb-4 max-h-40 overflow-y-auto">
                  <div className="text-white/50 text-[11px] mb-1 truncate">«{heard}»</div>
                  <div className="text-white text-sm leading-relaxed">{answer}</div>
                </motion.div>
              ) : (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center mb-4">
                  <div className="text-white font-semibold text-lg">
                    {phase === 'listening' ? (supported ? 'Слушаю…' : 'Напиши команду') : 'Чем помочь?'}
                  </div>
                  {phase === 'listening' && (
                    <div className="flex items-center justify-center gap-1 mt-2 h-6">
                      {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <motion.div key={i} className="w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                          animate={{ height: [4, 16, 6, 20, 4] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.12 }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
              {SIRI_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleCommand(s)}
                  className="flex-shrink-0 px-3 py-1.5 glass rounded-full text-white/80 text-xs active:scale-95 transition-transform">
                  {s}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div className="flex gap-2">
              <input ref={inputRef} value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && inputText.trim()) { handleCommand(inputText); setInputText(''); } }}
                placeholder="Или напишите команду…"
                className="flex-1 glass rounded-2xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/40" />
              <button onClick={startListening}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                  phase === 'listening' && !supported ? 'bg-red-500' : 'glass'}`}>
                {supported && phase === 'listening' ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-14 right-4 w-9 h-9 glass rounded-full flex items-center justify-center active:scale-90 transition-transform z-20">
            <X className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiriAssistant;
