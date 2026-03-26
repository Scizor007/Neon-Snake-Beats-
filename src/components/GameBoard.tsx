import React from 'react';
import { motion } from 'motion/react';
import { GRID_SIZE, Point } from '../utils/constants';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  gameOver: boolean;
  audioIntensity: number;
  resetGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, gameOver, audioIntensity, resetGame }) => {
  // Calculate dynamic glow based on audio intensity
  const glowSpread = 10 + audioIntensity * 30;
  const glowOpacity = 0.5 + audioIntensity * 0.5;

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      {/* Animated Border reacting to music */}
      <motion.div 
        className="absolute inset-0 rounded-xl z-0"
        animate={{
          boxShadow: `0 0 ${glowSpread}px rgba(0, 255, 255, ${glowOpacity}), inset 0 0 ${glowSpread/2}px rgba(0, 255, 255, ${glowOpacity * 0.5})`,
          borderColor: `rgba(0, 255, 255, ${glowOpacity})`
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
        style={{ border: '2px solid' }}
      />

      {/* Grid Container */}
      <div 
        className="absolute inset-2 bg-black/80 rounded-lg overflow-hidden z-10"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Lines (Optional, for cyberpunk feel) */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{
               backgroundImage: 'linear-gradient(var(--color-neon-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-neon-blue) 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`rounded-sm ${isHead ? 'bg-white z-20' : 'bg-[var(--color-neon-green)] z-10'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                boxShadow: isHead ? '0 0 10px white' : '0 0 8px var(--color-neon-green)'
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}

        {/* Food */}
        <motion.div
          className="bg-[var(--color-neon-pink)] rounded-full z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            boxShadow: '0 0 15px var(--color-neon-pink)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1 - audioIntensity * 0.5, // Pulses faster with music
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-neon-pink)] mb-2 text-center" style={{ textShadow: '0 0 20px var(--color-neon-pink)' }}>
            SYSTEM FAILURE
          </h2>
          <p className="text-gray-300 mb-8 font-mono text-lg tracking-widest">CONNECTION LOST</p>
          
          <button 
            onClick={resetGame}
            className="px-6 py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:scale-105 transition-transform glow-blue flex items-center gap-2"
          >
            REBOOT SYSTEM
          </button>
          <p className="text-xs text-gray-400 mt-4 font-mono">Or press Space</p>
        </motion.div>
      )}
    </div>
  );
};
