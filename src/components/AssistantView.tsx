import React, { useState } from 'react';

interface AssistantProps {
  onCommand: (cmd: string) => string; // возвращает текст ответа
  onClose: () => void;
}

interface Msg { role: 'user' | 'e'; text: string; }

const SUGGESTIONS = ['Время', 'Погода', 'Открой калькулятор', 'Тёмная тема', 'Что ты умеешь?'];

const AssistantView: React.FC<AssistantProps> = ({ onCommand, onClose }) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'e', text: 'Слушаю. Чем помочь?' },
  ]);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setListening(true);
    setInput('');
    // имитация «думания» ассистента
    setTimeout(() => {
      const answer = onCommand(t);
      setMessages(prev => [...prev, { role: 'user', text: t }, { role: 'e', text: answer }]);
      setListening(false);
    }, 600);
  };

  return (
    <div className="absolute inset-0 z-[130] animate-fade-in flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(88,28,135,0.55) 0%, rgba(0,0,0,0.92) 70%)' }}>
      {/* Шапка */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <span className="text-white/70 text-sm font-semibold tracking-wide">eSiri</span>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white active:bg-white/30">✕</button>
      </div>

      {/* Волна / микрофон */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={() => { if (!listening) send(input || 'Что ты умеешь?'); }}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
            ${listening ? 'bg-purple-500/80 scale-110' : 'bg-white/10 active:bg-white/20'}`}
          style={{ boxShadow: listening ? '0 0 40px rgba(168,85,247,0.8)' : '0 0 20px rgba(168,85,247,0.25)' }}>
          <span className="text-4xl">🎙️</span>
          {listening && <span className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping" />}
        </button>
        <span className="text-white/50 text-xs mt-3">{listening ? 'Обрабатываю…' : 'Нажмите и говорите'}</span>
      </div>

      {/* Диалог */}
      <div className="flex-1 overflow-y-auto px-5 space-y-2.5 pb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug notif-enter ${
              m.role === 'user' ? 'bg-blue-500/80 text-white' : 'glass-strong text-white/90'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Подсказки + ввод */}
      <div className="px-4 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs active:bg-white/25 border border-white/10">
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input); }}
            placeholder="Спросите что-нибудь…"
            className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/35 focus:border-purple-400/60" />
          <button onClick={() => send(input)}
            className="px-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold active:scale-95">
            ➤
          </button>
        </div>
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
};

export default AssistantView;
