import React from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  audioData: Uint8Array | null;
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ audioData, isPlaying }) => {
  // Use a subset of the frequency data for the visualizer bars
  const numBars = 32;
  const bars = Array.from({ length: numBars }).map((_, i) => {
    if (!audioData || !isPlaying) return 5; // Default minimum height
    
    // Map the 32 bars to the lower half of the frequency spectrum (where most music energy is)
    const dataIndex = Math.floor((i / numBars) * (audioData.length / 2));
    const value = audioData[dataIndex];
    
    // Normalize and scale
    return Math.max(5, (value / 255) * 100);
  });

  return (
    <div className="w-full h-24 flex items-end justify-center gap-[2px] overflow-hidden opacity-60">
      {bars.map((height, i) => {
        // Create a gradient effect across the bars
        const hue = 180 + (i / numBars) * 120; // From cyan to magenta
        
        return (
          <motion.div
            key={i}
            className="w-2 rounded-t-sm"
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              boxShadow: `0 0 10px hsl(${hue}, 100%, 50%)`
            }}
            animate={{ height: `${height}%` }}
            transition={{ type: 'tween', duration: 0.05, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
};
