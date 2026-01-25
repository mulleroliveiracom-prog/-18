
import React, { useState, useEffect, useRef } from 'react';
import { Category, GameItem } from '../types';
import { gameDatabase } from '../data/content';

interface WheelProps {
  category: Category;
  onComplete: (item: GameItem) => void;
  history: string[];
}

export const Wheel: React.FC<WheelProps> = ({ category, onComplete, history }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [slices, setSlices] = useState<GameItem[]>([]);
  
  const wheelRef = useRef<SVGSVGElement>(null);

  // Generate 12 slices for the wheel based on category
  useEffect(() => {
    const available = gameDatabase.filter(item => 
      item.categoria === category && !history.slice(0, 25).includes(item.id)
    );
    const selectedSlices = [];
    for(let i = 0; i < 12; i++) {
      selectedSlices.push(available[Math.floor(Math.random() * available.length)]);
    }
    setSlices(selectedSlices);
  }, [category]);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowModal(false);
    setTimer(null);

    // Audio context for procedural sound
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTick = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    };

    const extraSpins = 5 + Math.random() * 5;
    const finalRotation = rotation + (extraSpins * 360) + (Math.random() * 360);
    setRotation(finalRotation);

    // Simulate tick sounds during rotation
    let currentRotation = rotation;
    const interval = setInterval(() => {
      playTick();
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      
      // Calculate which slice stopped at the top (pointer is at 0 degrees)
      const normalizedRotation = (finalRotation % 360);
      const sliceIndex = Math.floor(((360 - normalizedRotation + 15) % 360) / 30);
      const winner = slices[sliceIndex % 12];
      
      setSelectedItem(winner);
      setShowModal(true);

      // Win sound
      const winOsc = audioCtx.createOscillator();
      const winGain = audioCtx.createGain();
      winOsc.frequency.setValueAtTime(440, audioCtx.currentTime);
      winOsc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
      winGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      winGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      winOsc.connect(winGain);
      winGain.connect(audioCtx.destination);
      winOsc.start();
      winOsc.stop(audioCtx.currentTime + 0.8);
    }, 4000);
  };

  const startTimer = () => {
    setTimer(30);
    const ticTacSound = () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 800;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        ticTacSound();
        return prev ? prev - 1 : 0;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-4">
      {/* Circular Wheel UI */}
      <div className="relative w-80 h-80 mb-12">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10 bg-yellow-500 clip-path-polygon-[50%_100%,0_0,100%_0] shadow-lg flex items-start justify-center pt-1">
           <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>

        {/* The Wheel */}
        <div 
          className="w-full h-full rounded-full border-8 border-zinc-900 shadow-[0_0_50px_rgba(202,138,4,0.3)] overflow-hidden bg-zinc-950 relative"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0, 0.1, 1)' : 'none'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slices.map((item, i) => (
              <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                <path 
                  d="M 50 50 L 50 0 A 50 50 0 0 1 75 6.7 Z" 
                  fill={i % 2 === 0 ? '#111' : '#000'}
                  stroke="#222"
                  strokeWidth="0.5"
                />
                <g transform="translate(58, 12) rotate(15)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={i % 2 === 0 ? '#ca8a04' : '#854d0e'}>
                    <path d={item.iconeSvg} />
                  </svg>
                </g>
              </g>
            ))}
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_black_70%)] opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900 rounded-full border-4 border-yellow-600 shadow-xl flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={spin}
        disabled={isSpinning}
        className={`relative overflow-hidden px-16 py-5 bg-gradient-to-b from-red-600 to-red-900 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-[0_10px_0_rgb(127,29,29)] transform transition-all active:translate-y-1 active:shadow-none ${isSpinning ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
      >
        <span className="relative z-10 neon-red">GIRAR VIP</span>
        {isSpinning && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
      </button>

      {/* Mission Card Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-900 border-2 border-yellow-600/30 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="relative h-72 bg-gradient-to-b from-yellow-900/40 to-zinc-900 flex flex-col items-center justify-center p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.15),_transparent_70%)]"></div>
              <div className="w-48 h-48 relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse"></div>
                <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] relative z-10" fill="currentColor">
                  <path d={selectedItem.iconeSvg} />
                </svg>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="px-4 py-1 bg-yellow-600 text-black text-[10px] font-black rounded-full uppercase tracking-widest">{selectedItem.categoria}</span>
              </div>
            </div>
            
            <div className="p-10 pt-4 space-y-6">
              <div className="text-center">
                <h2 className="font-luxury text-4xl text-yellow-500 mb-2 leading-none">{selectedItem.nome}</h2>
                <p className="text-zinc-400 italic text-sm">"{selectedItem.descricao}"</p>
              </div>

              <div className="bg-black/60 rounded-3xl p-6 border border-zinc-800 space-y-4">
                <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em]">Instruções Detalhadas</h3>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                  {selectedItem.instrucoesDetalhes}
                </div>
              </div>

              {timer !== null && (
                <div className="flex flex-col items-center py-2">
                  <div className="text-5xl font-black text-red-600 mb-3 font-mono drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    00:{timer < 10 ? `0${timer}` : timer}
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
                    <div 
                      className="bg-red-600 h-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(220,38,38,1)]"
                      style={{ width: `${(timer / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={startTimer}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-black py-5 rounded-2xl transition-all shadow-[0_5px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none"
                >
                  INICIAR AGORA!
                </button>
                <button 
                  onClick={() => {
                    onComplete(selectedItem);
                    setShowModal(false);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-black py-5 rounded-2xl transition-all shadow-[0_5px_0_rgb(39,39,42)] active:translate-y-1 active:shadow-none"
                >
                  CONCLUÍDO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
