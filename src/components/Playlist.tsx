import React from 'react';
import { Play, Sparkles, Loader2, AudioLines } from 'lucide-react';

interface PlaylistProps {
  tracks: any[];
  currentTrackIndex: number;
  playTrack: (index: number) => void;
  isPlaying: boolean;
  handleGenerate: () => void;
  isGenerating: boolean;
  genStatus: string;
}

export const Playlist: React.FC<PlaylistProps> = ({ 
  tracks, currentTrackIndex, playTrack, isPlaying, handleGenerate, isGenerating, genStatus 
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AudioLines className="text-[var(--color-neon-pink)]" />
          AI Playlist
        </h2>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-neon-pink)]/20 text-[var(--color-neon-pink)] border border-[var(--color-neon-pink)]/50 hover:bg-[var(--color-neon-pink)]/30 transition-all disabled:opacity-50 text-xs font-bold tracking-wider"
        >
          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isGenerating ? (genStatus || "GENERATING...") : "AI PLAYLIST"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            onClick={() => playTrack(idx)}
            className={`flex items-center p-2 rounded-xl cursor-pointer transition-all group ${idx === currentTrackIndex ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5 border border-transparent'}`}
          >
            <div className="relative w-12 h-12 mr-4 flex-shrink-0">
              <img 
                src={track.coverArt} 
                alt={track.title} 
                className="w-full h-full rounded-md object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${idx === currentTrackIndex && isPlaying ? 'opacity-100' : ''}`}>
                {idx === currentTrackIndex && isPlaying ? (
                  <AudioLines size={20} className="text-[var(--color-neon-green)] animate-pulse" />
                ) : (
                  <Play size={20} className="text-white ml-1" fill="currentColor" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-bold truncate ${idx === currentTrackIndex ? 'text-[var(--color-neon-green)]' : 'text-white'}`}>
                {track.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
            <div className="text-xs text-gray-500 font-mono ml-2">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
