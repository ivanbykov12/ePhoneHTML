import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 16;

const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]],
];

const COLORS = ['#00f0f0','#f0f000','#a000f0','#0000f0','#f0a000','#00f000','#f00000'];

type Board = number[][];

const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [piece, setPiece] = useState<{ shape: number[][]; x: number; y: number; color: number } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const newPiece = useCallback(() => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[idx].map(r => [...r]),
      x: Math.floor(COLS / 2) - 1,
      y: 0,
      color: idx + 1,
    };
  }, []);

  const isValid = useCallback((b: Board, shape: number[][], x: number, y: number) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nx = x + c;
          const ny = y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && b[ny][nx]) return false;
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((b: Board, p: typeof piece) => {
    if (!p) return b;
    const nb = b.map(r => [...r]);
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c] && p.y + r >= 0) {
          nb[p.y + r][p.x + c] = p.color;
        }
      }
    }
    return nb;
  }, []);

  const clearLines = useCallback((b: Board) => {
    const nb = b.filter(row => row.some(cell => cell === 0));
    const cleared = ROWS - nb.length;
    while (nb.length < ROWS) nb.unshift(Array(COLS).fill(0));
    return { board: nb, cleared };
  }, []);

  const startGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    const p = newPiece();
    setPiece(p);
  };

  const moveDown = useCallback(() => {
    setPiece(prev => {
      if (!prev) return prev;
      if (isValid(board, prev.shape, prev.x, prev.y + 1)) {
        return { ...prev, y: prev.y + 1 };
      }
      const nb = placePiece(board, prev);
      const { board: clearedBoard, cleared } = clearLines(nb);
      setBoard(clearedBoard);
      if (cleared > 0) setScore(s => s + cleared * 100);
      const np = newPiece();
      if (!isValid(clearedBoard, np.shape, np.x, np.y)) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(h => Math.max(h, score));
        return null;
      }
      return np;
    });
  }, [board, isValid, placePiece, clearLines, newPiece, score]);

  const moveLeft = () => {
    setPiece(prev => {
      if (!prev) return prev;
      if (isValid(board, prev.shape, prev.x - 1, prev.y)) return { ...prev, x: prev.x - 1 };
      return prev;
    });
  };

  const moveRight = () => {
    setPiece(prev => {
      if (!prev) return prev;
      if (isValid(board, prev.shape, prev.x + 1, prev.y)) return { ...prev, x: prev.x + 1 };
      return prev;
    });
  };

  const rotate = () => {
    setPiece(prev => {
      if (!prev) return prev;
      const rotated = prev.shape[0].map((_, i) => prev.shape.map(r => r[i]).reverse());
      if (isValid(board, rotated, prev.x, prev.y)) return { ...prev, shape: rotated };
      return prev;
    });
  };

  const hardDrop = () => {
    setPiece(prev => {
      if (!prev) return prev;
      let y = prev.y;
      while (isValid(board, prev.shape, prev.x, y + 1)) y++;
      const nb = placePiece(board, { ...prev, y });
      const { board: clearedBoard, cleared } = clearLines(nb);
      setBoard(clearedBoard);
      if (cleared > 0) setScore(s => s + cleared * 100);
      const np = newPiece();
      if (!isValid(clearedBoard, np.shape, np.x, np.y)) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(h => Math.max(h, score));
        return null;
      }
      return np;
    });
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      intervalRef.current = window.setInterval(moveDown, Math.max(100, 500 - score));
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [isPlaying, gameOver, moveDown, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, moveDown]);

  const renderBoard = () => {
    const display = board.map(r => [...r]);
    if (piece) {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c] && piece.y + r >= 0 && piece.y + r < ROWS) {
            display[piece.y + r][piece.x + c] = piece.color;
          }
        }
      }
    }
    return display;
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center pt-2">
      <div className="text-white text-lg font-bold mb-2">🧱 Тетрис</div>
      <div className="flex gap-8 text-white text-sm mb-3">
        <span>Счёт: {score}</span>
        <span>Рекорд: {highScore}</span>
      </div>

      <div className="relative border-2 border-blue-500/50 rounded-lg overflow-hidden" style={{ width: COLS * CELL, height: ROWS * CELL }}>
        <div className="absolute inset-0 bg-gray-800">
          {renderBoard().map((row, ri) =>
            row.map((cell, ci) => (
              cell ? (
                <div
                  key={`${ri}-${ci}`}
                  className="absolute border border-white/20 rounded-sm"
                  style={{
                    left: ci * CELL,
                    top: ri * CELL,
                    width: CELL - 1,
                    height: CELL - 1,
                    backgroundColor: COLORS[cell - 1] || '#555',
                  }}
                />
              ) : null
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-red-400 text-xl font-bold">Game Over!</div>
            <div className="text-white mt-2">Счёт: {score}</div>
            <button onClick={startGame} className="mt-4 px-6 py-2 bg-blue-500 rounded-full text-white font-bold active:scale-90">
              Заново
            </button>
          </div>
        )}

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <button onClick={startGame} className="px-8 py-3 bg-blue-500 rounded-full text-white font-bold text-lg active:scale-90">
              ▶ Играть
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3">
        <button onClick={moveLeft} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">←</button>
        <button onClick={rotate} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">↻</button>
        <button onClick={moveDown} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">↓</button>
        <button onClick={hardDrop} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-bold active:bg-blue-500">DROP</button>
        <button onClick={moveRight} className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-gray-600">→</button>
      </div>
    </div>
  );
};

export default TetrisGame;
