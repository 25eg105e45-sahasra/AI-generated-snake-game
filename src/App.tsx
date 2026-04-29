import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative flex flex-col pt-8 pb-12 px-4 md:px-8 selection:bg-fuchsia-500/30">
      {/* The background needs min-h-screen and absolute positioning to stay contained but scrollable */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[140px] mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[140px] mix-blend-screen"></div>
      </div>
      
      {/* Header */}
      <header className="mb-10 w-full max-w-6xl mx-auto flex justify-between items-end z-10 border-b border-gray-800/50 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 tracking-tighter drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                NEON<span className="text-white">SERPENT</span>
            </h1>
            <p className="text-fuchsia-400/80 font-mono text-sm tracking-widest mt-1.5 ml-1">CYBERNETIC RECREATION UNIT</p>
          </div>
          
          <div className="hidden md:block">
              <div className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-400 font-mono text-xs tracking-widest uppercase shadow-inner shadow-black/50">
                 System: <span className="text-cyan-400 animate-pulse drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Online</span>
              </div>
          </div>
      </header>
      
      {/* Main Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
         
         <div className="flex-1 flex justify-center w-full min-w-[320px]">
            <SnakeGame />
         </div>

         <aside className="w-full max-w-md shrink-0 flex flex-col gap-8">
            <MusicPlayer />
            
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6 hidden md:block">
                <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full shadow-[0_0_5px_rgba(217,70,239,0.8)]"></span>
                    Diagnostic Info
                </h3>
                <ul className="text-gray-500 font-mono text-xs space-y-3 opacity-80">
                    <li className="flex justify-between items-center border-b border-gray-800/40 pb-2">
                        <span>Version</span> 
                        <span className="text-cyan-600 bg-cyan-950/30 px-2 py-0.5 rounded">v2.0.4-beta</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-800/40 pb-2">
                        <span>Process</span> 
                        <span className="text-fuchsia-600">Reactive Matrix</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Network</span> 
                        <span className="text-emerald-500">Secured</span>
                    </li>
                </ul>
            </div>
         </aside>

      </main>
    </div>
  );
}
