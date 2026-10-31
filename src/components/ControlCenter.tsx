import React, { useState } from 'react';
import { useAppContext, getBottomSafeArea } from '../context/AppContext';
import { 
  Wifi, Bluetooth, Sun, Volume2, Flashlight, Camera, Calculator, 
  Timer, Plus, Power, Play, SkipBack, SkipForward, Airplay, Lock, BellOff, Plane, Moon, ChevronRight
} from 'lucide-react';

const ControlCenter: React.FC = () => {
  const { settings, setSettings, showControlCenter, setShowControlCenter } = useAppContext();
  
  const [airplane, setAirplane] = useState(false);
  const [cellular, setCellular] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [flashlight, setFlashlight] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [volume, setVolume] = useState(70);

  // Увеличил отступы, чтобы не наезжало на статус-бар
  const getPaddingTop = () => {
    switch (settings.phoneModel) {
      case 'iphone14': return '80px';
      case 'iphonex': return '70px';
      case 'iphone8': return '36px';
      case 'epad101': return '40px';
      default: return '80px';
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { setShowControlCenter(false); setIsClosing(false); }, 300);
  };

  if (!showControlCenter && !isClosing) return null;

  const animClass = isClosing ? 'animate-fade-out' : 'animate-fade-in';

  return (
    <div className={`absolute inset-0 z-[100] ${animClass}`}>
      {/* Более плотный фон, чтобы иконки не просвечивали */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl" onClick={handleClose} />
      
      {/* Контент обрезается по нижнюю рамку корпуса (на iPhone 8 — 80px с кнопкой Home),
          чтобы Пункт управления не перекрывал рамку и кнопку. */}
      <div className="absolute flex flex-col items-center overflow-y-auto hide-scrollbar"
        style={{ top: 0, left: 0, right: 0, bottom: getBottomSafeArea(settings.phoneModel), paddingTop: getPaddingTop() }}>
        
        {/* Жесткий контейнер ровно по центру */}
        <div className="w-[348px] flex flex-col gap-3 pb-10">
          
          {/* Верхняя панель (Плюс и Питание) */}
          <div className="flex justify-between items-center px-1 mb-4">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 transition-all">
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 transition-all">
              <Power className="w-5 h-5" />
            </button>
          </div>

          {/* РЯД 1: Квадраты 168x168 */}
          <div className="flex gap-3">
            {/* Блок связи */}
            <div className="w-[168px] h-[168px] bg-white/10 backdrop-blur-md rounded-[28px] p-3 grid grid-cols-2 gap-2">
              <button onClick={() => setAirplane(!airplane)} className={`rounded-full flex items-center justify-center ${airplane ? 'bg-orange-500 text-white' : 'bg-white/10 text-white'}`}>
                <Plane className="w-6 h-6" />
              </button>
              <button onClick={() => setCellular(!cellular)} className={`rounded-full flex items-center justify-center ${cellular ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}>
                <span className="material-icons text-2xl">signal_cellular_4_bar</span>
              </button>
              <button onClick={() => setWifi(!wifi)} className={`rounded-full flex items-center justify-center ${wifi ? 'bg-blue-500 text-white' : 'bg-white/10 text-white'}`}>
                <Wifi className="w-6 h-6" />
              </button>
              <button onClick={() => setBluetooth(!bluetooth)} className={`rounded-full flex items-center justify-center ${bluetooth ? 'bg-blue-500 text-white' : 'bg-white/10 text-white'}`}>
                <Bluetooth className="w-6 h-6" />
              </button>
            </div>

            {/* Блок музыки */}
            <div className="w-[168px] h-[168px] bg-white/10 backdrop-blur-md rounded-[28px] relative">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="text-white text-[13px] font-medium truncate pr-1">Not Playing</div>
                <Airplay className="w-5 h-5 text-white/60 flex-shrink-0" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <button className="text-white active:text-white/70 p-1"><SkipBack className="w-5 h-5 fill-current" /></button>
                <button className="text-white active:scale-95 p-1"><Play className="w-7 h-7 fill-current" /></button>
                <button className="text-white active:text-white/70 p-1"><SkipForward className="w-5 h-5 fill-current" /></button>
              </div>
            </div>
          </div>

          {/* РЯД 2: Кнопки и Слайдеры */}
          <div className="flex gap-3">
            
            {/* Левая колонка (Кнопки + Focus) */}
            <div className="w-[168px] flex flex-col gap-3">
              <div className="flex gap-3">
                <button className="w-[78px] h-[78px] rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
                  <Lock className="w-7 h-7" />
                </button>
                <button className="w-[78px] h-[78px] rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
                  <BellOff className="w-7 h-7" />
                </button>
              </div>
              <button className="w-[168px] h-[48px] bg-white/10 backdrop-blur-md rounded-full flex items-center px-4 gap-3 text-white active:bg-white/20">
                <Moon className="w-5 h-5" />
                <span className="text-sm font-medium flex-1 text-left">Focus</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Правая колонка (Слайдеры) */}
            <div className="flex gap-3">
              {/* Громкость */}
              <div className="relative w-[78px] h-[138px] bg-white/10 backdrop-blur-md rounded-[35px] overflow-hidden flex-shrink-0">
                <div className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-75" style={{ height: `${volume}%` }} />
                <input 
                  type="range" min="0" max="100" value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <Volume2 className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 z-0 ${volume > 0 ? 'text-black' : 'text-white'}`} />
              </div>

              {/* Яркость */}
              <div className="relative w-[78px] h-[138px] bg-white/10 backdrop-blur-md rounded-[35px] overflow-hidden flex-shrink-0">
                <div className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-75" style={{ height: `${settings.brightness}%` }} />
                <input 
                  type="range" min="30" max="100" value={settings.brightness} 
                  onChange={(e) => setSettings(s => ({...s, brightness: Number(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <Sun className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 z-0 ${settings.brightness > 30 ? 'text-black' : 'text-white'}`} />
              </div>
            </div>
          </div>

          {/* РЯД 3: Быстрые действия */}
          <div className="flex justify-between w-full">
            <button onClick={() => setFlashlight(!flashlight)} className={`w-[78px] h-[78px] rounded-full flex items-center justify-center active:bg-white/20 ${flashlight ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
              <Flashlight className="w-7 h-7" />
            </button>
            <button className="w-[78px] h-[78px] rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
              <Timer className="w-7 h-7" />
            </button>
            <button className="w-[78px] h-[78px] rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
              <Calculator className="w-7 h-7" />
            </button>
            <button className="w-[78px] h-[78px] rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
              <Camera className="w-7 h-7" />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ControlCenter;
