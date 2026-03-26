import { useState, useEffect, useRef } from 'react';
import { TRACKS as INITIAL_TRACKS } from '../utils/constants';

export const useAudioPlayer = () => {
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [audioIntensity, setAudioIntensity] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();

  const currentTrack = tracks[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.volume = volume;

    const handleEnded = () => {
      playNext();
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.pause();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle track change
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    }
  }, [currentTrackIndex]);

  // Handle play/pause state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Initialize Web Audio API on first play to comply with browser policies
        if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }

        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }

        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });

        startVisualizer();
      } else {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setAudioIntensity(0);
      }
    }
  }, [isPlaying]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startVisualizer = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));

      // Calculate average intensity for glow effects
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      setAudioIntensity(average / 255); // Normalize to 0-1

      animationRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const playNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const addTrack = (track: any) => {
    setTracks(prev => {
      setCurrentTrackIndex(prev.length);
      return [...prev, track];
    });
    setIsPlaying(true);
  };

  const addTracks = (newTracks: any[]) => {
    setTracks(prev => {
      setCurrentTrackIndex(prev.length); // Play the first of the newly added tracks
      return [...prev, ...newTracks];
    });
    setIsPlaying(true);
  };

  const seek = (percentage: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(percentage);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return {
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
    addTracks,
    playTrack,
  };
};
