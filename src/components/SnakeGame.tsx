import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Use refs for values that are used in the loop to avoid stale closures
  // and unnecessary re-renders of the game loop itself.
  const foodRef = useRef(food);
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const scoreRef = useRef(score);

  const gameLoopRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef(150); // ms per move
  const hasMovedRef = useRef(true);

  // Sync refs with state
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = useCallback(() => {
    const newFood = generateFood(INITIAL_SNAKE);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(newFood);
    
    // Reset Refs explicitly here just to be safe
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    foodRef.current = newFood;
    speedRef.current = 150;
  }, [generateFood]);

  const togglePause = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsPaused((prev) => !prev);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        togglePause();
        return;
      }

      if (isPaused || gameOver) return;
      if (!hasMovedRef.current) return;

      const currentDir = directionRef.current;
      let newDir = currentDir;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      if (newDir.x !== currentDir.x || newDir.y !== currentDir.y) {
        setDirection(newDir);
        directionRef.current = newDir;
        hasMovedRef.current = false;
      }
    },
    [isPaused, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback(
    (timestamp: number) => {
      if (isPaused || gameOver) return;

      if (timestamp - lastUpdateRef.current >= speedRef.current) {
        const currentSnake = snakeRef.current;
        const currentDir = directionRef.current;
        const currentFood = foodRef.current;
        
        const head = currentSnake[0];
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check walls collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return; // Stop update loop logic
        }

        // Check self collision
        if (
          currentSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return;
        }

        const newSnake = [newHead, ...currentSnake];

        // Check food
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore((s) => s + 10);
          const nextFood = generateFood(newSnake);
          setFood(nextFood);
          
          speedRef.current = Math.max(60, speedRef.current - 2); // Speed up
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        setSnake(newSnake);
        snakeRef.current = newSnake;
        hasMovedRef.current = true;
        
        lastUpdateRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(updateGame);
    },
    [isPaused, gameOver, generateFood]
  );

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    if (!isPaused) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [updateGame, isPaused, gameOver, score, highScore]);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header Stats */}
      <div className="w-full flex justify-between items-end mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Score</span>
          <span className="text-5xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] font-mono leading-none">{score}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] mb-1">
            <Trophy className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold">High Score</span>
          </div>
          <span className="text-3xl font-bold text-gray-300 tracking-widest font-mono leading-none">{highScore}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-[3px] bg-gradient-to-br from-emerald-400 via-cyan-500 to-fuchsia-600 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.2)]">
        {/* Game Grid */}
        <div 
          className="relative bg-gray-950 rounded-lg overflow-hidden shadow-inner"
          style={{
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`,
            backgroundImage: `linear-gradient(to right, #1f293740 1px, transparent 1px), linear-gradient(to bottom, #1f293740 1px, transparent 1px)`,
            backgroundSize: `20px 20px`
          }}
        >
          {/* Food */}
          <div
            className="absolute rounded-full bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.9),0_0_30px_rgba(217,70,239,0.6)] animate-[pulse_1s_ease-in-out_infinite]"
            style={{
              width: '20px',
              height: '20px',
              left: `${food.x * 20}px`,
              top: `${food.y * 20}px`,
            }}
          >
             <div className="absolute inset-[4px] bg-white rounded-full opacity-50 blur-[1px]"></div>
          </div>

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm transition-all duration-75 ${
                  isHead 
                    ? 'bg-gradient-to-br from-emerald-300 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,1),0_0_20px_rgba(52,211,153,0.5)] z-10' 
                    : 'bg-emerald-600/90 shadow-[0_0_8px_rgba(5,150,105,0.6)]'
                }`}
                style={{
                  width: '20px',
                  height: '20px',
                  left: `${segment.x * 20}px`,
                  top: `${segment.y * 20}px`,
                  transform: isHead ? 'scale(1.1)' : 'scale(0.9)',
                  border: isHead ? '2px solid #a7f3d0' : '1px solid #065f46',
                }}
              >
                  {isHead && (
                      <div className="w-full h-full relative">
                          <div className={`absolute w-1.5 h-1.5 bg-black rounded-full ${direction.x === 1 ? 'right-0.5 top-1/2 -translate-y-1/2' : direction.x === -1 ? 'left-0.5 top-1/2 -translate-y-1/2' : direction.y === 1 ? 'bottom-0.5 left-1/2 -translate-x-1/2' : 'top-0.5 left-1/2 -translate-x-1/2'}`}></div>
                      </div>
                  )}
              </div>
            );
          })}
        </div>

        {/* Status Overlays */}
        {gameOver && (
          <div className="absolute inset-[3px] z-20 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-[4px] rounded-lg border-2 border-red-500/50 shadow-[inset_0_0_60px_rgba(239,68,68,0.3)]">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">Crushed</h2>
            <p className="text-gray-200 mb-8 font-mono text-lg">Score: <span className="text-white font-bold">{score}</span></p>
            <button
              onClick={resetGame}
              className="group flex items-center gap-3 px-8 py-4 bg-gray-900 border-2 border-red-500 text-red-50 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-700 relative z-10" />
              <span className="font-bold tracking-widest uppercase text-sm relative z-10">Reboot System</span>
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-[3px] z-20 flex flex-col items-center justify-center bg-gray-950/70 backdrop-blur-[3px] rounded-lg">
            <button
              onClick={togglePause}
              className="group flex flex-col items-center justify-center"
            >
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400 text-cyan-400 rounded-full group-hover:bg-cyan-950 group-hover:text-cyan-300 transition-all shadow-[0_0_25px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] group-hover:scale-105">
                <Play className="w-12 h-12 ml-2" />
              </div>
            </button>
            <p className="mt-8 px-4 py-2 bg-gray-900/80 border border-cyan-500/30 rounded text-cyan-400 font-mono text-sm tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.2)]">PRESS <kbd className="font-bold text-white tracking-widest mx-1 bg-gray-800 px-2 py-0.5 rounded shadow">SPACE</kbd> TO WAKE</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-mono text-gray-500 opacity-80">
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <span className="w-6 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">W</span>
                <span className="w-6 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">A</span>
                <span className="w-6 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">S</span>
                <span className="w-6 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">D</span>
            </div>
            <span>/</span>
            <span className="px-3 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">ARROWS</span> 
            <span className="ml-1 text-gray-600 uppercase tracking-widest text-[10px]">Navigate</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-4 h-6 bg-gray-800 rounded border-b-2 border-gray-700 text-gray-400 flex items-center justify-center">SPACE</span>
            <span className="text-gray-600 uppercase tracking-widest text-[10px]">Pause/Resume</span>
        </div>
      </div>
    </div>
  );
}
