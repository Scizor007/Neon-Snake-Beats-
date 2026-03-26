import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomPlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  volume: number;
  progress: number;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (v: number) => void;
  seek: (p: number) => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentTrack, isPlaying, volume, progress, togglePlayPause, playNext, playPrevious, setVolume, seek
}) => {
  
  const parseDuration = (dur: string) => {
    const parts = dur.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const totalSeconds = parseDuration(currentTrack.duration);
  const currentSeconds = Math.floor((progress / 100) * totalSeconds) || 0;
  
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    return `${Math.floor(secs / 60)}:${Math.floor(secs % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 flex items-center px-4 md:px-8 z-50">
      {/* Left: Track Info */}
      <div className="flex items-center w-1/3 gap-4">
        <img 
          src={currentTrack.coverArt} 
          alt="cover" 
          className="w-14 h-14 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.2)] object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="hidden sm:block min-w-0">
          <h4 className="text-white font-bold text-sm truncate">{currentTrack.title}</h4>
          <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center w-1/3 gap-2">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <Shuffle size={16} />
          </button>
          <button onClick={playPrevious} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlayPause} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform glow-blue"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <Repeat size={16} />
          </button>
        </div>
        <div className="w-full flex items-center gap-2 max-w-md">
          <span className="text-[10px] text-gray-400 w-8 text-right font-mono">
            {formatTime(currentSeconds)}
          </span>
          <div 
            className="flex-1 h-1 bg-gray-800 rounded-full cursor-pointer relative group" 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[var(--color-neon-green)] rounded-full" 
              style={{ width: `${progress}%` }} 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
              style={{ left: `calc(${progress}% - 6px)` }} 
            />
          </div>
          <span className="text-[10px] text-gray-400 w-8 font-mono">
            {currentTrack.duration}
          </span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end w-1/3 gap-2">
        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-gray-400 hover:text-white transition-colors hidden sm:block">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))} 
          className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer hidden sm:block" 
          style={{ accentColor: 'var(--color-neon-green)' }} 
        />
      </div>
    </div>
  );
};
