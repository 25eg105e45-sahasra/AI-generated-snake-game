import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    title: "Neon Horizon (AI Generate)",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Cybernetic Pulse (AI Generate)",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Digital Awakening (AI Generate)",
    artist: "AI Overlord",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-fuchsia-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/5 to-cyan-600/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
      
      <div className="z-10 w-full flex flex-col items-center">
        {/* Disc Visualizer */}
        <div className="w-32 h-32 rounded-full bg-gray-950 border-4 border-gray-800 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center mb-6 overflow-hidden relative">
           <div className={`absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent ${isPlaying ? 'animate-pulse' : ''}`}></div>
           <div className={`absolute inset-0 border-2 border-fuchsia-500/30 rounded-full scale-110 ${isPlaying ? 'animate-ping duration-[3000ms]' : ''}`}></div>
           
           <Disc3 className={`w-16 h-16 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
           
           {/* Center hole */}
           <div className="absolute w-4 h-4 bg-gray-900 rounded-full border border-gray-700"></div>
        </div>

        <div className="text-center w-full px-2 mb-6">
          <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full mb-3">
             <span className="text-[10px] uppercase font-mono tracking-widest text-fuchsia-400">Now Playing</span>
          </div>
          <h3 className="text-white font-bold text-lg truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">{currentTrack.title}</h3>
          <p className="text-cyan-400/80 text-sm truncate font-mono mt-1">{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 w-full mb-6">
          <button onClick={handlePrev} className="text-gray-400 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handlePlayPause} 
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>

          <button onClick={handleNext} className="text-gray-400 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center w-full px-4 gap-4 bg-gray-950/50 py-2 rounded-full border border-gray-800/50">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors shrink-0">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="relative w-full h-1 bg-gray-800 rounded-full group cursor-pointer">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            {/* Custom volume track */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full z-10 pointer-events-none shadow-[0_0_8px_rgba(217,70,239,0.6)]"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            ></div>
            {/* Custom volume thumb */}
            <div 
               className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full z-10 pointer-events-none shadow-lg group-hover:scale-125 transition-transform"
               style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }}
            ></div>
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleNext}
      />
    </div>
  );
}
