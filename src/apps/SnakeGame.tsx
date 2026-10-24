import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 16;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const dirRef = useRef<Direction>('RIGHT');
  const gameRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    setSnake(prev => {
      const head = { ...prev[0] };
      const dir = dirRef.current;

      switch (dir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prev;
      }

      if (prev.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prev;
      }

      const newSnake = [head, ...prev];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          setHighScore(h => Math.max(h, newScore));
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const speed = Math.max(50, INITIAL_SPEED - score);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, moveSnake, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp': if (dir !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); } break;
        case 'ArrowDown': if (dir !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); } break;
        case 'ArrowLeft': if (dir !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); } break;
        case 'ArrowRight': if (dir !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); } break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSwipe = (dir: Direction) => {
    const current = dirRef.current;
    if (dir === 'UP' && current !== 'DOWN') { dirRef.current = dir; setDirection(dir); }
    if (dir === 'DOWN' && current !== 'UP') { dirRef.current = dir; setDirection(dir); }
    if (dir === 'LEFT' && current !== 'RIGHT') { dirRef.current = dir; setDirection(dir); }
    if (dir === 'RIGHT' && current !== 'LEFT') { dirRef.current = dir; setDirection(dir); }
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center pt-16">
      <div className="text-white text-lg font-bold mb-2">🐍 Змейка</div>
      <div className="flex gap-8 text-white text-sm mb-3">
        <span>Счёт: {score}</span>
        <span>Рекорд: {highScore}</span>
      </div>

      <div
        ref={gameRef}
        className="relative border-2 border-green-500/50 rounded-lg overflow-hidden"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Grid */}
        <div className="absolute inset-0 bg-gray-800">
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`absolute rounded-sm ${i === 0 ? 'bg-green-400' : 'bg-green-500'}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
              }}
            />
          ))}
          <div
            className="absolute bg-red-500 rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-red-400 text-xl font-bold">Game Over!</div>
            <div className="text-white mt-2">Счёт: {score}</div>
            <button onClick={resetGame} className="mt-4 px-6 py-2 bg-green-500 rounded-full text-white font-bold active:scale-90">
              Заново
            </button>
          </div>
        )}

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <button onClick={resetGame} className="px-8 py-3 bg-green-500 rounded-full text-white font-bold text-lg active:scale-90">
              ▶ Играть
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-36">
        <div />
        <button onClick={() => handleSwipe('UP')} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">↑</button>
        <div />
        <button onClick={() => handleSwipe('LEFT')} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">←</button>
        <button onClick={() => handleSwipe('DOWN')} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">↓</button>
        <button onClick={() => handleSwipe('RIGHT')} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">→</button>
      </div>
    </div>
  );
};

export default SnakeGame;
