export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const CHILL_SPEED = 150;
export const HARD_SPEED_START = 120;
export const HARD_SPEED_MIN = 50;
export const SPEED_DECREMENT = 2;

export type Point = { x: number; y: number };
export type GameMode = 'chill' | 'hard';

export const TRACKS = [
  {
    id: 1,
    title: "Neon Rain (AI Gen)",
    artist: "Lyria-3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
    coverArt: "https://picsum.photos/seed/neoncyber1/150/150?blur=2"
  },
  {
    id: 2,
    title: "Cybernetic Horizon (AI Gen)",
    artist: "Lyria-3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
    coverArt: "https://picsum.photos/seed/neoncyber2/150/150?blur=2"
  },
  {
    id: 3,
    title: "Digital Overdrive (AI Gen)",
    artist: "Lyria-3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
    coverArt: "https://picsum.photos/seed/neoncyber3/150/150?blur=2"
  }
];
