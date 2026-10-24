import React, { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_W = 320;
const CANVAS_H = 480;
const BIRD_SIZE = 20;
const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 130;
const PIPE_SPEED = 2.5;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const FlappyBird: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const gameData = useRef({
    birdY: CANVAS_H / 2,
    birdVel: 0,
    pipes: [] as Pipe[],
    frameCount: 0,
    score: 0,
  });
  const animRef = useRef<number>(0);

  const jump = useCallback(() => {
    if (gameState === 'idle') {
      setGameState('playing');
      gameData.current = {
        birdY: CANVAS_H / 2,
        birdVel: JUMP,
        pipes: [],
        frameCount: 0,
        score: 0,
      };
      setScore(0);
    } else if (gameState === 'playing') {
      gameData.current.birdVel = JUMP;
    } else if (gameState === 'over') {
      setGameState('idle');
    }
  }, [gameState]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      const data = gameData.current;

      if (gameState === 'playing') {
        data.birdVel += GRAVITY;
        data.birdY += data.birdVel;
        data.frameCount++;

        if (data.frameCount % 90 === 0) {
          const topHeight = 50 + Math.random() * (CANVAS_H - PIPE_GAP - 100);
          data.pipes.push({ x: CANVAS_W, topHeight, passed: false });
        }

        data.pipes = data.pipes.filter(p => p.x > -PIPE_WIDTH);
        data.pipes.forEach(p => { p.x -= PIPE_SPEED; });

        // Collision
        const birdTop = data.birdY - BIRD_SIZE / 2;
        const birdBottom = data.birdY + BIRD_SIZE / 2;
        const birdLeft = 60 - BIRD_SIZE / 2;
        const birdRight = 60 + BIRD_SIZE / 2;

        if (birdBottom > CANVAS_H || birdTop < 0) {
          setGameState('over');
          setBestScore(b => Math.max(b, data.score));
        }

        for (const pipe of data.pipes) {
          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
              setGameState('over');
              setBestScore(b => Math.max(b, data.score));
            }
          }
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 60) {
            pipe.passed = true;
            data.score++;
            setScore(data.score);
          }
        }
      }

      // Draw
      // Sky
      ctx.fillStyle = '#4ec0ca';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(80, 60, 20, 0, Math.PI * 2);
      ctx.arc(100, 55, 25, 0, Math.PI * 2);
      ctx.arc(120, 60, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ground
      ctx.fillStyle = '#ded895';
      ctx.fillRect(0, CANVAS_H - 40, CANVAS_W, 40);
      ctx.fillStyle = '#5a8a2a';
      ctx.fillRect(0, CANVAS_H - 40, CANVAS_W, 5);

      // Pipes
      data.pipes.forEach(pipe => {
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_H - pipe.topHeight - PIPE_GAP);
        ctx.fillStyle = '#558b20';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 20, PIPE_WIDTH + 6, 20);
        ctx.fillRect(pipe.x - 3, pipe.topHeight + PIPE_GAP, PIPE_WIDTH + 6, 20);
      });

      // Bird
      const birdY = gameState === 'idle' ? CANVAS_H / 2 + Math.sin(Date.now() / 200) * 10 : data.birdY;
      ctx.fillStyle = '#f5c842';
      ctx.beginPath();
      ctx.arc(60, birdY, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(65, birdY - 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(67, birdY - 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e87e24';
      ctx.beginPath();
      ctx.moveTo(72, birdY);
      ctx.lineTo(82, birdY + 2);
      ctx.lineTo(72, birdY + 5);
      ctx.fill();

      // Score
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(String(data.score), CANVAS_W / 2, 60);
      ctx.fillText(String(data.score), CANVAS_W / 2, 60);

      animRef.current = requestAnimationFrame(gameLoop);
    };

    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameState]);

  return (
    <div className="w-full h-full bg-sky-400 flex flex-col items-center pt-2">
      <div className="text-white text-lg font-bold mb-2">🐦 Flappy Bird</div>
      <div className="flex gap-6 text-white text-sm mb-3">
        <span>Счёт: {score}</span>
        <span>Лучший: {bestScore}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-xl border-2 border-white/30 cursor-pointer"
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      />

      {gameState === 'over' && (
        <div className="mt-3 text-center">
          <div className="text-white text-lg font-bold">💀 Game Over!</div>
          <button onClick={() => setGameState('idle')} className="mt-2 px-6 py-2 bg-green-500 rounded-full text-white font-bold active:scale-90">
            Заново
          </button>
        </div>
      )}

      {gameState === 'idle' && (
        <div className="mt-3 text-center">
          <div className="text-white text-sm">Нажми для старта</div>
        </div>
      )}
    </div>
  );
};

export default FlappyBird;
