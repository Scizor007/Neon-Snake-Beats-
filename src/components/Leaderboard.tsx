import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  currentScore: number;
  gameOver: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, gameOver }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('snakeHighScore');
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
  }, []);

  useEffect(() => {
    if (gameOver && currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('snakeHighScore', currentScore.toString());
    }
  }, [gameOver, currentScore, highScore]);

  return (
    <div className="glass-panel rounded-xl p-4 flex items-center justify-between w-full max-w-md mx-auto">
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-sans">Current Score</span>
        <span className="text-3xl font-mono font-bold text-white text-glow-blue">
          {currentScore.toString().padStart(4, '0')}
        </span>
      </div>
      
      <div className="h-10 w-px bg-gray-700 mx-4"></div>
      
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-sans flex items-center gap-1">
          <Trophy size={12} className="text-yellow-500" /> High Score
        </span>
        <span className="text-3xl font-mono font-bold text-yellow-500" style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}>
          {highScore.toString().padStart(4, '0')}
        </span>
      </div>
    </div>
  );
};
