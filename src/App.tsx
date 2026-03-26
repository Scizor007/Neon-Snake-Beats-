import { useState, useEffect } from 'react';
import { GameMode } from './utils/constants';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { GameBoard } from './components/GameBoard';
import { BottomPlayer } from './components/BottomPlayer';
import { Playlist } from './components/Playlist';
import { Visualizer } from './components/Visualizer';
import { Leaderboard } from './components/Leaderboard';
import { RefreshCw, Zap, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [mode, setMode] = useState<GameMode>('hard');
  
  const {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    setIsPaused,
    resetGame
  } = useSnakeGame(mode);

  const {
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    volume,
    progress,
    audioData,
    audioIntensity,
    togglePlayPause,
    playNext,
    playPrevious,
    setVolume,
    seek,
    addTrack,
    playTrack
  } = useAudioPlayer();

  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenStatus("Authenticating...");

      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const aistudio = (window as any).aistudio;
        if (!(await aistudio.hasSelectedApiKey())) {
          await aistudio.openSelectKey();
        }
      }

      setGenStatus("Generating 3 Tracks...");

      const prompts = [
        { title: "Neon Overdrive", prompt: "A 30-second fast-paced cyberpunk synthwave track with heavy bass, dark synthwave, and neon arpeggios, suitable for a retro arcade game." },
        { title: "Blade Runner Blues", prompt: "A 30-second slow, atmospheric cyberpunk track with deep Vangelis-style synth pads, echoing rain sounds, and a melancholic neon vibe." },
        { title: "Glitch City", prompt: "A 30-second high-energy techno track with glitchy effects, a driving four-on-the-floor beat, and a futuristic cyberpunk atmosphere." }
      ];

      const generateTrack = async (trackInfo: { title: string, prompt: string }, index: number) => {
        const apiKey = (process.env as any).API_KEY || (process.env as any).GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContentStream({
          model: "lyria-3-clip-preview",
          contents: trackInfo.prompt,
        });

        let audioBase64 = "";
        let mimeType = "audio/wav";

        for await (const chunk of response) {
          const parts = chunk.candidates?.[0]?.content?.parts;
          if (!parts) continue;
          for (const part of parts) {
            if (part.inlineData?.data) {
              if (!audioBase64 && part.inlineData.mimeType) {
                mimeType = part.inlineData.mimeType;
              }
              audioBase64 += part.inlineData.data;
            }
          }
        }

        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);

        return {
          id: Date.now() + index,
          title: trackInfo.title,
          artist: "Lyria-3 AI",
          url: audioUrl,
          duration: "0:30",
          coverArt: `https://picsum.photos/seed/${Date.now() + index}/150/150?blur=2`
        };
      };

      const newTracks = await Promise.all(prompts.map((p, i) => generateTrack(p, i)));

      setGenStatus("Adding Tracks...");
      addTracks(newTracks);

    } catch (error: any) {
      console.error("Failed to generate music:", error);
      if (error.message?.includes("Requested entity was not found")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
        }
      }
      alert("Failed to generate music. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
      setGenStatus("");
    }
  };

  // Handle spacebar for music play/pause AND game restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else {
          togglePlayPause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, resetGame, togglePlayPause]);

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--color-dark-bg)] text-white overflow-hidden relative">
      {/* Background ambient glow based on music */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0, 255, 255, ${audioIntensity * 0.15}) 0%, transparent 70%)`
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-y-auto pb-32 custom-scrollbar">
        
        {/* Left Column: Game Controls & Leaderboard */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="glass-panel p-6 rounded-2xl">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)]">
              NEON SNAKE
            </h1>
            <p className="text-sm text-gray-400 mb-6 font-mono">v2.0.4 // SYSTEM ONLINE</p>
            
            <div className="space-y-4">
              <div className="flex bg-black/50 p-1 rounded-lg border border-gray-800">
                <button
                  onClick={() => { setMode('chill'); resetGame(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'chill' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Coffee size={16} /> Chill
                </button>
                <button
                  onClick={() => { setMode('hard'); resetGame(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'hard' ? 'bg-[var(--color-neon-pink)]/20 text-[var(--color-neon-pink)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Zap size={16} /> Hard
                </button>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={18} className={gameOver ? "animate-spin-slow" : ""} />
                {gameOver ? "Reboot System" : "Restart Game"}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Controls</h3>
              <ul className="space-y-2 text-sm text-gray-400 font-mono">
                <li><span className="text-white">WASD / Arrows</span> : Move</li>
                <li><span className="text-white">Space</span> : Play/Pause Music</li>
              </ul>
            </div>
          </div>

          <Leaderboard currentScore={score} gameOver={gameOver} />
        </div>

        {/* Center Column: Game Board */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <GameBoard 
                snake={snake} 
                food={food} 
                gameOver={gameOver} 
                audioIntensity={audioIntensity}
                resetGame={resetGame}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Playlist & Visualizer */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <Playlist 
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            playTrack={playTrack}
            isPlaying={isPlaying}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            genStatus={genStatus}
          />

          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-end min-h-[150px]">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Audio Visualizer</h3>
            <Visualizer audioData={audioData} isPlaying={isPlaying} />
          </div>
        </div>

      </div>

      {/* Bottom Player */}
      <BottomPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        progress={progress}
        togglePlayPause={togglePlayPause}
        playNext={playNext}
        playPrevious={playPrevious}
        setVolume={setVolume}
        seek={seek}
      />
    </div>
  );
}
