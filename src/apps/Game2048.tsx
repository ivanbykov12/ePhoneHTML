import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 4;

type Grid = number[][];

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function initGrid(): Grid {
    const g = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    addRandom(g);
    addRandom(g);
    return g;
  }

  function addRandom(g: Grid) {
    const empty: [number, number][] = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (g[r][c] === 0) empty.push([r, c]);
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    g[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function slide(row: number[]): { result: number[]; pts: number } {
    let pts = 0;
    const filtered = row.filter(x => x !== 0);
    const result: number[] = [];
    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        result.push(merged);
        pts += merged;
        i += 2;
      } else {
        result.push(filtered[i]);
        i++;
      }
    }
    while (result.length < SIZE) result.push(0);
    return { result, pts };
  }

  function rotate(g: Grid): Grid {
    const n: Grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        n[c][SIZE - 1 - r] = g[r][c];
    return n;
  }

  function move(dir: string) {
    if (gameOver) return;
    let g = grid.map(r => [...r]);
    let rotations = 0;
    if (dir === 'left') rotations = 0;
    else if (dir === 'down') rotations = 1;
    else if (dir === 'right') rotations = 2;
    else if (dir === 'up') rotations = 3;

    for (let i = 0; i < rotations; i++) g = rotate(g);
    let totalPts = 0;
    for (let r = 0; r < SIZE; r++) {
      const { result, pts } = slide(g[r]);
      g[r] = result;
      totalPts += pts;
    }
    for (let i = 0; i < (4 - rotations) % 4; i++) g = rotate(g);

    const changed = JSON.stringify(g) !== JSON.stringify(grid);
    if (changed) {
      addRandom(g);
      setGrid(g);
      const newScore = score + totalPts;
      setScore(newScore);
      setBestScore(b => Math.max(b, newScore));
      if (g.some(r => r.includes(2048)) && !won) setWon(true);
      if (isGameOver(g)) setGameOver(true);
    }
  }

  function isGameOver(g: Grid): boolean {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        if (g[r][c] === 0) return false;
        if (c < SIZE - 1 && g[r][c] === g[r][c + 1]) return false;
        if (r < SIZE - 1 && g[r][c] === g[r + 1][c]) return false;
      }
    return true;
  }

  const resetGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move('left');
      else if (e.key === 'ArrowRight') move('right');
      else if (e.key === 'ArrowUp') move('up');
      else if (e.key === 'ArrowDown') move('down');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, gameOver]);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-yellow-100 text-gray-800',
      4: 'bg-yellow-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-yellow-700 text-white',
      2048: 'bg-yellow-800 text-white',
    };
    return colors[val] || 'bg-purple-900 text-white';
  };

  return (
    <div className="w-full h-full bg-amber-900 flex flex-col items-center">
      <div className="text-white text-lg font-bold mb-2">🎮 2048</div>
      <div className="flex gap-6 text-white text-sm mb-3">
        <span>Счёт: {score}</span>
        <span>Лучший: {bestScore}</span>
      </div>

      <div className="bg-amber-800 p-2 rounded-xl">
        {grid.map((row, ri) => (
          <div key={ri} className="flex gap-2 mb-2 last:mb-0">
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg ${
                  cell === 0 ? 'bg-amber-700' : getTileColor(cell)
                }`}
              >
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || won) && (
        <div className="mt-4 flex flex-col items-center">
          <div className="text-white text-xl font-bold">{won ? '🎉 Победа!' : '💀 Игра окончена!'}</div>
          <button onClick={resetGame} className="mt-3 px-6 py-2 bg-amber-600 rounded-full text-white font-bold active:scale-90">
            Заново
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-36">
        <div />
        <button onClick={() => move('up')} className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-amber-600">↑</button>
        <div />
        <button onClick={() => move('left')} className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-amber-600">←</button>
        <button onClick={() => move('down')} className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-amber-600">↓</button>
        <button onClick={() => move('right')} className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-white text-xl active:bg-amber-600">→</button>
      </div>
    </div>
  );
};

export default Game2048;
