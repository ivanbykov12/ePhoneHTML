import React, { useState } from 'react';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const inputDigit = (d: string) => {
    if (resetNext) {
      setDisplay(d);
      setResetNext(false);
    } else {
      setDisplay(display === '0' ? d : display + d);
    }
  };

  const inputDot = () => {
    if (resetNext) { setDisplay('0.'); setResetNext(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); };

  const performOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op) {
      const p = parseFloat(prev);
      let result = 0;
      switch (op) {
        case '+': result = p + current; break;
        case '-': result = p - current; break;
        case '×': result = p * current; break;
        case '÷': result = current !== 0 ? p / current : 0; break;
      }
      setDisplay(String(result));
      setPrev(String(result));
    } else {
      setPrev(display);
    }
    setOp(nextOp);
    setResetNext(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const p = parseFloat(prev);
    let result = 0;
    switch (op) {
      case '+': result = p + current; break;
      case '-': result = p - current; break;
      case '×': result = p * current; break;
      case '÷': result = current !== 0 ? p / current : 0; break;
    }
    setDisplay(String(parseFloat(result.toFixed(8))));
    setPrev(null);
    setOp(null);
    setResetNext(true);
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handlePress = (btn: string) => {
    switch (btn) {
      case 'C': clear(); break;
      case '±': toggleSign(); break;
      case '%': percent(); break;
      case '=': equals(); break;
      case '.': inputDot(); break;
      case '+': case '-': case '×': case '÷': performOp(btn); break;
      default: inputDigit(btn);
    }
  };

  const getButtonStyle = (btn: string) => {
    if (['÷', '×', '-', '+', '='].includes(btn)) return 'bg-orange-500 text-white active:bg-orange-400';
    if (['C', '±', '%'].includes(btn)) return 'bg-gray-400 text-black active:bg-gray-300';
    return 'bg-gray-700 text-white active:bg-gray-600';
  };

  return (
    <div className="w-full h-full bg-black flex flex-col pt-2 px-4">
      <div className="flex-1 flex items-end justify-end pb-4">
        <span className="text-white text-5xl font-light truncate">{display}</span>
      </div>
      <div className="space-y-3 pb-8">
        {buttons.map((row, ri) => (
          <div key={ri} className="flex gap-3">
            {row.map(btn => (
              <button
                key={btn}
                onClick={() => handlePress(btn)}
                className={`${
                  btn === '0' ? 'flex-[2]' : 'flex-1'
                } h-16 rounded-full ${getButtonStyle(btn)} text-2xl font-medium flex items-center justify-center active:scale-95 transition-transform`}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;
